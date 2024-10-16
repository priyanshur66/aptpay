"use client";
import React, { useState, useEffect } from "react";
import { useUserStore, usePaymentInfoStore } from "../../../store";
import { AptosAccount, Types, HexString, AptosClient } from "aptos";
import { useRouter } from "next/navigation";
import crypto from "crypto";


export default function TokenPayment() {
  
  const router = useRouter();
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState("0");
  const [selectedCurrency, setSelectedCurrency] = useState("apt");

  const tokens = ["Token A", "Token B", "Token C"];
  const { user, setDpk } = useUserStore();
  const { paymentInfo, setPaymentToken,setPaymentAddress,setPaymentAmount } = usePaymentInfoStore();
  const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
  const aptosClient = new AptosClient(NODE_URL);

  const handleTokenChange = (event) => {
    setSelectedToken(event.target.value);
  };

  const handleAmountChange = (event) => {
    setPaymentAmount(event.target.value);
    setAmount(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handlePay = () => {
    console.log(`Paying ${amount} ${selectedCurrency} using ${selectedToken}`);
  };

  const keys = crypto
    .createHash("sha256")
    .update(process.env.NEXT_PUBLIC_ENCRYPT_KEY)
    .digest();
  async function getDPK(
    encryptedData = user.encData,
    iv = user.iv,
    key = keys
  ) {
    console.log("user details areeee", user);
    const algorithm = "aes-256-cbc";
    const ivBuffer = Buffer.from(iv, "hex");
    const encryptedTextBuffer = Buffer.from(encryptedData, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    setDpk(decrypted.toString());
    return decrypted.toString();
  }

  async function transferLegacyCoin(
    amount = 1,
    toAddress = "0xc3df44663b7541bc5ce2793c12814dad216cdf05855c66381a8cb797e6bf9656",
    contractAddress = "0x1::aptos_coin::AptosCoin"
  ) {
    try {
      //const sender = new AptosAccount(privateKey);
      const sender = new AptosAccount(
        HexString.ensure(user.dpk).toUint8Array()
      );
      const amountInOctas = BigInt(Math.floor(1 * 100000000)); 

      const payload = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer_coins",
        type_arguments: [contractAddress],
        arguments: [toAddress, amountInOctas.toString()],
      };

      console.log(
        "Sending transaction with amount:",
        amountInOctas.toString(),
        "Octas"
      );

      const rawTxn = await aptosClient.generateTransaction(
        sender.address(),
        payload
      );
      const signedTxn = await aptosClient.signTransaction(sender, rawTxn);
      const pendingTxn = await aptosClient.submitTransaction(signedTxn);
      await aptosClient.waitForTransaction(pendingTxn.hash);
      console.log(pendingTxn.hash);
      return pendingTxn.hash;
    } catch (error) {
      console.error("Error in transferLegacyCoin:", error);
      throw error;
    }
  }

  const handleRouter = () => {
    router.push("/getdiscount");
  };

  useEffect(() => {
    const Fetch = async () => {
      const res = await getDPK();
      console.log(res);
    };
    Fetch();
  }, []);

  console.log(user.dpk);

  return (
    <div className="max-w-4xl mt-40 mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label
          htmlFor="token-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Token
        </label>
        <select
          id="token-select"
          value={selectedToken}
          onChange={handleTokenChange}
          className="w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select token</option>
          {tokens.map((token, index) => (
            <option key={index} value={token}>
              {token}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="amount-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Amount
        </label>
        <input
          id="amount-input"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="w-full p-2 text-4xl font-bold text-black text-center border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        onClick={handleRouter}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Pay
      </button>
      <button onClick={transferLegacyCoin}>sim txn </button>
    </div>
  );
}
