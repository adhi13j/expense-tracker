import React, { useState } from "react";

import { supabase } from "../lib/supabaseClient";

function ExpenseForm({ onNewExpense }) {
  const [amount, setAmount] = useState("");
  const [income, setIncome] = useState("");
  const [category, setCategory] = useState("food");
  const handleExpenseSubmit = async (event) => {
    event.preventDefault();

    if (!amount) {
      alert("Please enter an amount.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      category: category,
      amount: parseFloat(amount),
      income : 0,
      date: new Date().toISOString().slice(0, 10), // Get today's date in YYYY-MM-DD format
    };

    const { error } = await supabase.from("Transactions").insert([newExpense]);

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
  const handleIncomeSubmit = async (event) => {
    event.preventDefault();

    if (!income) {
      alert("Please enter an income.");
      return;
    }

    const newIncome = {
      id: Date.now(),
      category: category,
      amount: 0,
      income : income,
      date: new Date().toISOString().slice(0, 10), // Get today's date in YYYY-MM-DD format
    };

    const { error } = await supabase.from("Transactions").insert([newIncome]);

    if (error) {
      // If there was an error, show it to the user
      alert("Error adding expense: " + error.message);
    } else {
      // If it was successful, clear the form fields
      setIncome("");
      console.log("Income added successfully!");
      onNewExpense();
    }
  };
  return (
    <div>
      <form onSubmit={handleExpenseSubmit}>
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
      <form onSubmit={handleIncomeSubmit}>
        <h2>Add Income</h2>
        <input
          type="number"
          placeholder="0.00"
          value={income}
          onChange={(e) => {
            setIncome(e.target.value);
          }}
        ></input>
        <button type="submit">
          Add Income
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
