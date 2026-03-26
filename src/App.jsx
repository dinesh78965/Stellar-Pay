import { useEffect, useState } from "react";
import {
  isConnected,
  requestAccess,
  getAddress,
} from "@stellar/freighter-api";
import { fetchXlmBalance, sendXlm } from "./lib/stellar";

const initialForm = {
  destination: "",
  amount: "",
};

function shortenAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-3)}`;
}

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0.0000000");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const restoreWallet = async () => {
      try {
        const { isConnected: connected } = await isConnected();
        if (!connected) return;

        const { address, error } = await getAddress();
        if (error) throw new Error(error);

        setWalletAddress(address);
      } catch (err) {
        setError(err.message);
      }
    };
    restoreWallet();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      if (!walletAddress) return;
      const bal = await fetchXlmBalance(walletAddress);
      setBalance(bal);
    };
    loadBalance();
  }, [walletAddress]);

  const handleConnect = async () => {
    setError("");
    try {
      setIsBusy(true);
      const res = await requestAccess();
      if (!res.address) throw new Error(res.error);
      setWalletAddress(res.address);
      setStatus("Connected");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress("");
    setBalance("0.0000000");
    setStatus("Disconnected");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = async () => {
    setError("");
    setStatus("");
    setTxHash("");

    try {
      if (!walletAddress) throw new Error("Connect wallet first");
      if (!form.destination) throw new Error("Enter address");
      if (!form.amount || Number(form.amount) <= 0)
        throw new Error("Invalid amount");

      setIsBusy(true);

      const result = await sendXlm({
        sourcePublicKey: walletAddress,
        destinationPublicKey: form.destination,
        amount: form.amount,
      });

      setStatus("Success ✅");
      setTxHash(result.hash);
      setForm(initialForm);

      const newBal = await fetchXlmBalance(walletAddress);
      setBalance(newBal);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* 🔝 HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">Stellar Pay 💫</h1>

        {walletAddress ? (
          <button
            onClick={handleDisconnect}
            className="bg-red-500 px-4 py-2 rounded-xl"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={handleConnect}
            className="bg-cyan-500 px-4 py-2 rounded-xl"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* 🧾 MAIN CARD */}
      <div className="flex justify-center mt-10 px-4">
        <div className="w-full max-w-[400px] bg-slate-800 p-6 rounded-2xl shadow-lg space-y-4">

          {/* Wallet Info */}
          {walletAddress && (
            <div className="text-sm text-slate-300">
              <p>Wallet: {shortenAddress(walletAddress)}</p>
              <p>Balance: {balance} XLM</p>
            </div>
          )}

          <h2 className="text-lg font-semibold">Send Payment</h2>

          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="Recipient Address"
            className="w-full p-3 rounded-xl bg-slate-700"
          />

          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount (XLM)"
            className="w-full p-3 rounded-xl bg-slate-700"
          />

          <button
            onClick={handleSend}
            disabled={isBusy || !walletAddress}
            className="w-full bg-cyan-500 py-3 rounded-xl disabled:opacity-50"
          >
            {isBusy ? "Processing..." : "Send Payment"}
          </button>

          {/* Status */}
          <div className="text-sm">
            <p>
              Status:{" "}
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : status ? (
                <span className="text-green-400">{status}</span>
              ) : (
                "Idle"
              )}
            </p>

            {txHash && (
              <p className="break-all text-xs mt-1">Tx: {txHash}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;