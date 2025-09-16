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
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-6">
        Add New Transaction
      </h3>

      <form onSubmit={handleTransactionSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-2 rounded-full bg-slate-200 dark:bg-slate-700 p-1">
          <button
            type="button"
            onClick={() => setTransactionType("expense")}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              transactionType === "expense"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setTransactionType("income")}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              transactionType === "income"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Income
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          {transactionType === "expense" && (
            <div className="flex-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-600 dark:text-slate-400"
              >
                Category
              </label>
              {categories.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  Please{" "}
                  
                  <a
                    href="/settings"
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    add a category
                  </a>
                  first.
                </p>
              ) : (
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          <div className="flex-1">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400"
          disabled={!amount}
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
