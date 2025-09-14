// src/components/HomePage.jsx
import { useEffect, useState } from "react";
import ExpenseForm from "../Components/ExpenseForm";
import ExpenseList from "../Components/ExpenseList";
import { supabase } from "../lib/supabaseClient";

function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState([]); // Renamed for clarity

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

      <hr />

      <h3>
        Wallet Balance:{" "}
        {todaysWallet.length > 0 ? todaysWallet[0].balance : "N/A"}
      </h3>

      <h3>Today's Data</h3>
      <ExpenseList transactions={todaysExpenses} />
    </div>
  );
}

export default HomePage;
