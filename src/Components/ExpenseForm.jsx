import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useCategories } from "../contexts/CategoryContext";

function ExpenseForm({ onNewTransaction }) {
   const { categories } = useCategories(); 
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [transactionType, setTransactionType] = useState("expense");

  
  const handleTransactionSubmit = async (event) => {
    event.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newTransaction = {
      type: transactionType,
      category: transactionType === "income" ? "income" : category,
      amount: transactionType === "expense" ? parseFloat(amount) : 0,
      income: transactionType === "income" ? parseFloat(amount) : 0,
      date: new Date().toISOString().slice(0, 10),
    };

    const { error } = await supabase
      .from("Transactions")
      .insert([newTransaction]);

    if (error) {
      alert("Error adding transaction: " + error.message);
    } else {
      setAmount("");
      setCategory("food");
      console.log("Transaction added successfully!");
      onNewTransaction();
    }
  };

  return (
    <div>
      <form onSubmit={handleTransactionSubmit}>
        {transactionType === "expense" && (
          // 3. Dynamically create the dropdown options
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
        <div>
          <label>
            <input
              type="radio"
              value="expense"
              checked={transactionType === "expense"}
              onChange={() => setTransactionType("expense")}
            />
            Expense
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              value="income"
              checked={transactionType === "income"}
              onChange={() => setTransactionType("income")}
            />
            Income
          </label>
        </div>

        {transactionType === "expense" && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="food">Food</option>
            <option value="entertainment">Entertainment</option>
            <option value="groceries">Groceries</option>
            <option value="bills">Bills</option>
          </select>
        )}

        <input
          type="number"
          placeholder={
            transactionType === "expense" ? "Expense Amount" : "Income Amount"
          }
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button type="submit">
          Add {transactionType === "expense" ? "Expense" : "Income"}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
