import React, { useState } from "react";

import { supabase } from "../lib/supabaseClient";

function ExpenseForm({ onNewExpense }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!amount) {
      alert("Please enter an amount.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      category: category,
      amount: parseFloat(amount),
      date: new Date().toISOString().slice(0, 10), // Get today's date in YYYY-MM-DD format
    };

    const { error } = await supabase.from("expenses").insert([newExpense]);

    if (error) {
      // If there was an error, show it to the user
      alert("Error adding expense: " + error.message);
    } else {
      // If it was successful, clear the form fields
      setAmount("");
      setCategory("food");
      console.log("Expense added successfully!");
      onNewExpense(); 
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      >
        <option value="food">Food</option>
        <option value="entertainment">entertainment</option>
        <option value="groceries">groceries</option>
        <option value="bills">Bills</option>
      </select>
      <input
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
        }}
      ></input>
      <h2>Add New Expense</h2>
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
