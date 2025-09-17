import React from "react";
function TransactionItem({ transaction, onDelete, onEdit }) {
  const isIncome = transaction.type === "income";
  const amountColor = isIncome ? "text-green-500" : "text-red-500";
  const sign = isIncome ? "+" : "-";

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="font-bold text-slate-800 dark:text-slate-200">
          {transaction.category}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {" "}
        {/* Reduced space for more buttons */}
        <p className={`font-semibold ${amountColor} mr-2`}>
          {" "}
          {sign} ₹
          {isIncome
            ? transaction.income.toFixed(2)
            : transaction.amount.toFixed(2)}
        </p>
        <button
          onClick={() => onEdit(transaction)}
          className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-500 hover:text-white text-xs font-bold py-1 px-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(transaction.id)}
          className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white text-xs font-bold py-1 px-2 rounded"
        >
          X
        </button>
      </div>
    </div>
  );
}

export default TransactionItem;
