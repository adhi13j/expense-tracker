import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

import ExpenseForm from "../Components/ExpenseForm";
import WalletBalance from "../Components/WalletBalance";
import TransactionItem from "../Components/TransactionItem";
import EditTransactionModal from "../Components/EditTransactionModal";

function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // --- Data Fetching ---
  const fetchBalance = async () => {
    const { data, error } = await supabase
      .from("Wallet")
      .select("balance")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching balance:", error);
    } else if (data) {
      setBalance(data.balance);
    } else {
      setBalance(0);
    }
  };

  const fetchTransactions = async () => {
    const Day_inPast = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await supabase
      .from("Transactions")
      .select("*")
      .gte("date", Day_inPast) 
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  const handleNewTransaction = () => {
    fetchTransactions();
    fetchBalance();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const { error } = await supabase
        .from("Transactions")
        .delete()
        .eq("id", id);
      if (error) {
        alert("Error deleting transaction: " + error.message);
      } else {
        handleNewTransaction();
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedTransaction) => {
    const { id, ...transactionData } = updatedTransaction;
    const { error } = await supabase
      .from("Transactions")
      .update(transactionData)
      .match({ id: id });

    if (error) {
      alert("Error updating transaction: " + error.message);
    } else {
      setIsModalOpen(false);
      setEditingTransaction(null);
      handleDataChange();
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const todaysTransactions = transactions.filter(
    (transaction) => transaction.date === today
  );

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <ExpenseForm onNewTransaction={handleNewTransaction} />

        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Today's Transactions
          </h2>
          <div className="space-y-4">
            {todaysTransactions.length > 0 ? (
              todaysTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400">
                No transactions recorded today.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <WalletBalance balance={balance} />
      </div>

      {isModalOpen && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default HomePage;
