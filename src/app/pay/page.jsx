"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  QrCode,
  ArrowUpCircle,
  ArrowDownCircle,
  Camera,
  Wallet,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore, usePaymentInfoStore } from "../../../store";
import { auth, db } from "@/config/firebaseConfig";

export default function PaymentPage() {
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();
  const [payHovered, setPayHovered] = useState(false);
  const [receiveHovered, setReceiveHovered] = useState(false);
  const [walletAddress, setWalletAddress] = useState('0xc3df44663b7541bc5ce2793c12814dad216cdf05855c66381a8cb797e6bf9656');
  const { user } = useUserStore();
  const { paymentInfo, setPaymentAddress, setPaymentToken, setPaymentAmount } = usePaymentInfoStore();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user.publicKey);
    alert("Wallet address copied!");
  };

  const handlePayment = () => {
    router.push("/payment");
  };

  const trimAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  const handleSetPaymentAddress = (address) => {
    setPaymentAddress(address);
    setWalletAddress(address);
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `https://fullnode.testnet.aptoslabs.com/v1/accounts/${user.publicKey}/transactions?limit=10`
        );
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#001F3F,#1E3A8A_34%,#3B82F6_85%,#3B82F6_95%)] relative overflow-clip p-4">
      <div className="max-w-4xl mt-20 mx-auto bg-slate-300 py-5  rounded-lg shadow-md p-6">
        <div className="flex justify-center space-x-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className={`bg-black rounded-full h-32 w-32 text-xl flex flex-col hover:bg-red-600 text-white transition-transform ${
                  payHovered ? "-translate-y-1" : ""
                }`}
                onMouseEnter={() => setPayHovered(true)}
                onMouseLeave={() => setPayHovered(false)}
              >
                <ArrowUpCircle className="h-8 w-8" />
                Pay
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pay</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <Button variant="outline">
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR Code
                </Button>
                <Input
                  onChange={(e) => handleSetPaymentAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="rounded-xl"
                />
                <Button
                  onClick={handlePayment}
                  className="bg-white border text-black hover:text-white hover:bg-black"
                >
                  Send Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className={`bg-black hover:bg-green-600 rounded-full h-32 w-32 text-xl flex flex-col text-white transition-transform ${
                  receiveHovered ? "translate-y-1" : ""
                }`}
                onMouseEnter={() => setReceiveHovered(true)}
                onMouseLeave={() => setReceiveHovered(false)}
              >
                <ArrowDownCircle className="h-8 w-8" />
                Receive
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Receive</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 items-center justify-items-center">
                <QrCode className="h-32 w-32" />
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{trimAddress(user.publicKey)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyAddress}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-center text-black">
            Recent Transactions
          </h2>
          <div>
          {transactions.length > 0 ? (
            transactions.slice().reverse().map((tx, index) => (
            <div className="bg-gray-50 text-black p-3 rounded-md mb-2" key={tx.hash}>
            <p>
        Transaction {transactions.length - index}:{" "}
        <a
          href={`https://explorer.aptoslabs.com/txn/${tx.hash}?network=testnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {tx.hash}
        </a>
      </p>
    </div>
  ))
) : (
  <p className="text-gray-500 ml-4">No transactions to display</p>
)}
    </div>
          <Link href="/transactionhistory">
            <Button variant="outline" className="w-full">
              View All Transactions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}