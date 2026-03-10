import { useState, useEffect } from "react";
import { walletApi } from "../../utils/api.js";
import { motion } from "framer-motion";

export default function WalletPage() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [topUpAmount, setTopUpAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [topping, setTopping] = useState(false);

    useEffect(() => {
        loadWallet();
    }, []);

    const loadWallet = async () => {
        try {
            const [balRes, histRes] = await Promise.all([walletApi.getBalance(), walletApi.getHistory()]);
            setBalance(balRes.balance || 0);
            setTransactions(histRes.transactions || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTopUp = async () => {
        const amount = parseFloat(topUpAmount);
        if (!amount || amount <= 0) return;
        try {
            setTopping(true);
            const res = await walletApi.topUp(amount);
            setBalance(res.balance);
            setTopUpAmount("");
            await loadWallet();
        } catch (err) {
            console.error(err);
        } finally {
            setTopping(false);
        }
    };

    const getTypeStyle = (type) => {
        const map = {
            CREDIT: { color: "text-emerald-600", icon: "↗️", prefix: "+" },
            DEBIT: { color: "text-red-600", icon: "↘️", prefix: "-" },
            ESCROW_HOLD: { color: "text-amber-600", icon: "🔒", prefix: "-" },
            ESCROW_RELEASE: { color: "text-blue-600", icon: "🔓", prefix: "+" },
            REFUND: { color: "text-emerald-600", icon: "💰", prefix: "+" },
        };
        return map[type] || { color: "text-gray-600", icon: "•", prefix: "" };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#6b4226] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Balance Card */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-gradient-to-br from-[#3b2f2f] via-[#5a4234] to-[#6b4226] rounded-3xl p-8 text-white mb-8 shadow-xl"
                >
                    <p className="text-sm text-[#d4c5b0] mb-1">Wallet Balance</p>
                    <h1 className="text-4xl font-bold mb-6">₹{balance.toFixed(2)}</h1>

                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
                        />
                        <button
                            onClick={handleTopUp}
                            disabled={topping}
                            className="px-6 py-3 bg-[#c8926b] hover:bg-[#b07d58] disabled:bg-[#8b7355] text-white rounded-xl font-semibold transition-all"
                        >
                            {topping ? "..." : "Top Up"}
                        </button>
                    </div>

                    <div className="flex gap-2 mt-4">
                        {[100, 250, 500, 1000].map((amt) => (
                            <button
                                key={amt}
                                onClick={() => setTopUpAmount(String(amt))}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
                            >
                                ₹{amt}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Transactions */}
                <h2 className="text-xl font-bold text-[#3b2f2f] mb-4">Transaction History</h2>

                {transactions.length === 0 ? (
                    <div className="text-center py-16 text-[#8b7355]">
                        <p className="text-5xl mb-4">💳</p>
                        <p>No transactions yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((tx, i) => {
                            const style = getTypeStyle(tx.type);
                            return (
                                <motion.div
                                    key={tx._id}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="bg-white rounded-xl p-4 shadow-sm border border-[#e8e0d4] flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{style.icon}</span>
                                        <div>
                                            <p className="font-medium text-[#3b2f2f] text-sm">{tx.type.replace(/_/g, " ")}</p>
                                            <p className="text-xs text-[#8b7355]">
                                                {tx.description || "—"} • {new Date(tx.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${style.color}`}>
                                            {style.prefix}₹{tx.amount.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-[#b09e86]">Bal: ₹{tx.balanceAfter.toFixed(2)}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
