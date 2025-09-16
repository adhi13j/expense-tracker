import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Import the new components
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
    // Fetch transactions from the last 30 days for performance
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await supabase
      .from("Transactions")
      .select("*")
      .gte("date", thirtyDaysAgo) // gte means 'greater than or equal to'
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

  // --- Handler Functions ---
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

  // --- Filtering for Today's Transactions ---
  const today = new Date().toISOString().slice(0, 10);
  const todaysTransactions = transactions.filter(
    (transaction) => transaction.date === today
  );

  return (
    // Main layout grid: 2 columns on medium screens and up, 1 column on small screens
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* --- LEFT COLUMN (main content) --- */}
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
                  onEdit={handleEdit} // Pass the handleEdit function
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

      {/* --- RIGHT COLUMN (sidebar) --- */}
      <div className="md:col-span-1">
        <WalletBalance balance={balance} />
      </div>

      {/* --- MODAL (not part of the grid) --- */}
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
