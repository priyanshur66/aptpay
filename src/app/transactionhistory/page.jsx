import React from 'react';

const SimpleTransactionHistory = ({ transactions }) => {
  
  const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalPaid = transactions.reduce((sum, t) => sum + (t.type === 'paid' ? parseFloat(t.amount) : 0), 0);
  const totalSponsored = transactions.reduce((sum, t) => sum + (t.type === 'sponsored' ? parseFloat(t.amount) : 0), 0);

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-4">
      <div className="mb-4 text-sm text-black flex space-x-96 font-bold">
        <p>Total amount: ${totalAmount.toFixed(2)}</p>
        <p>You paid: ${totalPaid.toFixed(2)}</p>
        <p>Sponsored amt: ${totalSponsored.toFixed(2)}</p>
      </div>
      <ul className="space-y-2">
        {transactions.map((transaction, index) => (
          <li key={index} className="border p-2 rounded-full px-8">
            <p>{transaction.description}</p>
            <p className={transaction.type === 'paid' ? 'text-red-600' : 'text-green-600'}>
              ${parseFloat(transaction.amount).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default function History() {
  const transactions = [
    { description: 'Payment to Alice', amount: '50', type: 'paid' },
    { description: 'Cashback', amount: '5', type: 'sponsored' },
    { description: 'Payment to Bob', amount: '30', type: 'paid' },
    { description: 'Payment to Alice', amount: '50', type: 'paid' },
    { description: 'Cashback', amount: '5', type: 'sponsored' },
    { description: 'Payment to Bob', amount: '30', type: 'paid' },
  ];

  return (
    <div className="p-4 bg-[linear-gradient(to_bottom,#001F3F,#1E3A8A_34%,#3B82F6_85%,#3B82F6_95%)] relative overflow-clip min-h-screen">
      <h1 className="text-7xl mt-16 mb-10 font-bold text-center ">Transaction History</h1>
      <SimpleTransactionHistory transactions={transactions} />
    </div>
  );
}