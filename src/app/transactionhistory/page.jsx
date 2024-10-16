"use client";
import React, { useState, useEffect } from "react";

const SimpleTransactionHistory = ({ initialTransactions }) => {
  const [transactions, setTransactions] = useState(initialTransactions || []);

  const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalPaid = transactions.reduce((sum, t) => sum + (t.type === "paid" ? parseFloat(t.amount) : 0), 0);
  const totalSponsored = transactions.reduce((sum, t) => sum + (t.type === "sponsored" ? parseFloat(t.amount) : 0), 0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://fullnode.testnet.aptoslabs.com/v1/accounts/0x3c2741892f6662acc186ff1d8447ba6caf19371aeb6a56d23489d3dfd39cef0a/transactions?limit=100"
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
    <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-4">
      <div className="mb-4 text-sm text-black flex space-x-96 font-bold">
        <p>Total amount: ${totalAmount.toFixed(2)}</p>
        <p>You paid: ${totalPaid.toFixed(2)}</p>
        <p>Sponsored amt: ${totalSponsored.toFixed(2)}</p>
      </div>
      <ul className="space-y-2">
        <div>
          {transactions.length > 0 ? (
            transactions.map((tx, index) => (
              <div className="bg-gray-50 text-black p-3 rounded-md mb-2" key={index}>
                <p>
                  Transaction {index + 1}:{" "}
                  <a
                    href={`https://explorer.aptoslabs.com/txn/${tx.hash}?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {tx.hash}
                  </a>
                </p>
              </div>
            ))
          ) : (
            <p>Loading transactions...</p>
          )}
        </div>
      </ul>
    </div>
  );
};

export default function History() {
  const transactions = [
  
  ];

  return (
    <div className="p-4 bg-[linear-gradient(to_bottom,#001F3F,#1E3A8A_34%,#3B82F6_85%,#3B82F6_95%)] relative overflow-clip min-h-screen">
      <h1 className="text-7xl mt-16 mb-10 font-bold text-center">Transaction History</h1>
      <SimpleTransactionHistory initialTransactions={transactions} />
    </div>
  );
}
