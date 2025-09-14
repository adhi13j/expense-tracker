// src/components/HomePage.jsx
import { useEffect, useState } from "react";
import ExpenseForm from "../Components/ExpenseForm";
import ExpenseList from "../Components/ExpenseList";
import { supabase } from "../lib/supabaseClient";
import EditTransactionModal from "../Components/EditTransactionModal"; 

function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchWallet = async () => {
    const { data, error } = await supabase.from("Wallet").select("*");
    if (error) {
      console.error("Error fetching Wallet:", error);
    } else {
      setWallet(data);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from("Transactions").select("*");
    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchWallet();
  }, []);

  // --- NEW HANDLER FUNCTION ---
  // This function ensures both the transaction list and the wallet are updated.
  const handleNewTransaction = async () => {
    await fetchTransactions();
    await fetchWallet();
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
        // The trigger will automatically update the wallet, so we just refetch
        handleNewTransaction();
      }
    }
  };

  // --- EDIT LOGIC (PART 1) ---
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // --- EDIT LOGIC (PART 2) ---
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
      // The trigger will automatically update the wallet, so we just refetch
      handleNewTransaction();
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  const todaysExpenses = transactions.filter(
    (transaction) => transaction.date.slice(0, 10) === today
  );

  const todaysWallet = wallet.filter(
    (balance) => balance.date.slice(0, 10) === today
  );

  return (
    <div>
      <h2>Home Page</h2>

      {/* Pass the new, combined handler to the form */}
      <ExpenseForm onNewTransaction={handleNewTransaction} />
      {isModalOpen && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      <hr />

      <h3>
        Wallet Balance:{" "}
        {todaysWallet.length > 0 ? todaysWallet[0].balance : "N/A"}
      </h3>

      <h3>Today's Data</h3>
      <ExpenseList
        transactions={todaysExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default HomePage;
