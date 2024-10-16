"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore, usePaymentInfoStore } from "../../../store";
export default function Component() {
  const [verificationStatus, setVerificationStatus] = useState("waiting");
  const [showRedirect, setShowRedirect] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const verificationTimer = setTimeout(() => {
      setVerificationStatus("complete");
    }, 5000);

    const redirectTimer = setTimeout(() => {
      setShowRedirect(true);
    }, 7000);

    const pageChangeTimer = setTimeout(() => {
      router.push("/discounted-payment");
    }, 10000);

    return () => {
      clearTimeout(verificationTimer);
      clearTimeout(redirectTimer);
      clearTimeout(pageChangeTimer);
    };
  }, [router]);
  const { paymentInfo, setPaymentAddress, setPaymentToken, setPaymentAmount } =
    usePaymentInfoStore();

  const containerVariants = {
    waiting: {
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    complete: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.5,
      },
    },
  };

  const circleVariants = {
    waiting: (i) => ({
      y: [0, -20],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        delay: i * 0.1,
      },
    }),
    complete: {
      y: 0,
      scale: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const tickVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-green-400 mb-8">
        {" "}
        Original Amount: {paymentInfo.amount}
      </h1>

      <motion.div
        className="bg-gray-800 rounded-lg p-8 shadow-lg mb-8 w-full max-w-2xl aspect-video flex flex-col items-center justify-center"
        variants={containerVariants}
        animate={verificationStatus}
      >
        {verificationStatus === "waiting" ? (
          <div className="flex justify-center items-center space-x-4 mb-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-6 h-6 bg-blue-500 rounded-full"
                variants={circleVariants}
                animate={verificationStatus}
                custom={i}
              />
            ))}
          </div>
        ) : (
          <motion.svg
            className="w-24 h-24 text-green-500"
            viewBox="0 0 50 50"
            initial="hidden"
            animate="visible"
          >
            <motion.circle
              cx="25"
              cy="25"
              r="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              variants={tickVariants}
            />
            <motion.path
              d="M15 24.5L22 32.5L35.5 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={tickVariants}
            />
          </motion.svg>
        )}
        <motion.p
          className="text-3xl font-semibold text-white text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {verificationStatus === "waiting"
            ? "Verifying..."
            : "Verification Complete!"}
        </motion.p>
      </motion.div>

      {showRedirect && (
        <motion.p
          className="text-xl text-green-400 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Redirecting to the payment page...
        </motion.p>
      )}

      <motion.a
        href="#"
        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 0.5 }}
      >
        Link To try out application
      </motion.a>
    </div>
  );
}
