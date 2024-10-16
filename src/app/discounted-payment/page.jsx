"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { AptosAccount, Types, HexString, AptosClient } from "aptos";
import { useUserStore, usePaymentInfoStore } from "../../../store";
import crypto from "crypto";
import dynamic from 'next/dynamic';

const ClientSideContent = dynamic(() => Promise.resolve(({ children }) => <>{children}</>), { ssr: false });

export default function DiscountSuccessPage() {
  const [showPayButton, setShowPayButton] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState("2");
  const [paymentAmount, setPaymentAmount] = useState(0);

  const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
  const aptosClient = new AptosClient(NODE_URL);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setDiscountedPrice(searchParams.get("price") || "2");
    
    const { paymentInfo } = usePaymentInfoStore.getState();
    setPaymentAmount(paymentInfo.amount);

    const timer = setTimeout(() => {
      setShowPayButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  async function transferLegacyCoin() {
    try {
      const { user } = useUserStore.getState();
      const { paymentInfo } = usePaymentInfoStore.getState();
      const sender = new AptosAccount(
        HexString.ensure(user?.dpk).toUint8Array()
      );
      const amountInOctas = BigInt(
        Math.floor((paymentAmount - 2) * 100000000)
      );

      const payload = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer_coins",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [paymentInfo.address, amountInOctas.toString()],
      };

      const rawTxn = await aptosClient.generateTransaction(
        sender.address(),
        payload
      );
      const signedTxn = await aptosClient.signTransaction(sender, rawTxn);
      const pendingTxn = await aptosClient.submitTransaction(signedTxn);
      await aptosClient.waitForTransaction(pendingTxn.hash);
      return pendingTxn.hash;
    } catch (error) {
      console.error("Error in transferLegacyCoin:", error);
      throw error;
    }
  }

  async function transferSponsoredAmount() {
    try {
      const { paymentInfo } = usePaymentInfoStore.getState();
      const sender = new AptosAccount(
        HexString.ensure(
          process.env.NEXT_PUBLIC_PAYMENT_FACILITATOR
        ).toUint8Array()
      );
      const amountInOctas = BigInt(Math.floor(2 * 100000000));

      const payload = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer_coins",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [paymentInfo.address, amountInOctas.toString()],
      };

      const rawTxn = await aptosClient.generateTransaction(
        sender.address(),
        payload
      );
      const signedTxn = await aptosClient.signTransaction(sender, rawTxn);
      const pendingTxn = await aptosClient.submitTransaction(signedTxn);
      await aptosClient.waitForTransaction(pendingTxn.hash);
      return pendingTxn.hash;
    } catch (error) {
      console.error("Error in transferSponsoredAmount:", error);
      throw error;
    }
  }

  const handlePayment = async () => {
    try {
      await transferLegacyCoin();
      await transferSponsoredAmount();
      window.location.href = "/payment-completion";
    } catch (error) {
      console.error("Payment failed:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <ClientSideContent>
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl px-4">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400 text-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            UPDATED PRICE: {paymentAmount - 2}Apt
          </motion.h1>

          <motion.div
            className="bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-green-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 1.3 }}
            />

            <motion.p
              className="text-xl sm:text-2xl text-white text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              You got a discount of
              <motion.span
                className="text-green-400 font-bold mx-2"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 2 }}
              >
                {discountedPrice} Apt
              </motion.span>
            </motion.p>

            <motion.p
              className="text-lg sm:text-xl text-white text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
            >
              Hooray! Let's proceed with the payment.
            </motion.p>

            {showPayButton && (
              <motion.button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full max-w-sm mx-52"
                onClick={handlePayment}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pay Now
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </ClientSideContent>
  );
}