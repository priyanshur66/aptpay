"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserStore, usePaymentInfoStore } from "../../../store";


export default function Dashboard() {
  const router = useRouter();
  const { paymentInfo, setPaymentAddress, setPaymentToken, setPaymentAmount } =
  usePaymentInfoStore();
  const boxes = [
    { title: 'Watch ad for about aptos ', price: 2, link: '/watch-Ad' },
    { title: 'Signup for platform x', price: 5, link: '#' },
    { title: 'Try application y', price: 7, link: '#' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const boxVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 0px 8px rgb(59, 130, 246)',
      transition: {
        type: 'spring',
        stiffness: 300,
      },
    }
  };

  const handleBoxClick = useCallback((link) => {
    router.push(link);
  }, [router]);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-green-400 mb-8 sm:mb-12">
          ORIGINAL PRICE: {paymentInfo?.amount}
        </h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {boxes.map((box, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer"
              variants={boxVariants}
              whileHover="hover"
              onClick={() => handleBoxClick(box.link)}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">{box.title}</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-400">{box.price} Apt</p>
              <div className="mt-4 h-2 bg-gray-700 rounded overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(box.price / 100) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}