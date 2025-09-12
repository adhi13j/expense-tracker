// src/components/HomePage.jsx
import { useEffect, useState } from "react";
import ExpenseForm from "../Components/ExpenseForm";
import ExpenseList from "../Components/ExpenseList";
import { supabase } from "../lib/supabaseClient"; // 2. Import supabase

function HomePage() {
  const [transactions, setTransactions] = useState([]);

  // 4. Create an async function to get the data
  const fetchTransactions = async () => {
    const { data, error } = await supabase.from("Transactions").select("*"); // Select all columns

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data); // Update the state with the fetched data
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []); 
  const today = new Date().toISOString().slice(0, 10);

  const todaysExpenses = transactions.filter(
    (transaction) =>transaction.date.slice(0, 10) === today
  );

  return (
    <div>
      <h2>Home Page</h2>
      {/* 3. The form is rendered here, and the handler is passed to it */}
      <ExpenseForm onNewExpense={fetchTransactions} />

      <hr />

      <h3>Today's Data</h3>
      <ExpenseList transactions={todaysExpenses} />
    </div>
  );
}

export default HomePage;
