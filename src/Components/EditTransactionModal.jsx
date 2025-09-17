import React, { useState, useEffect } from "react";

const modalStyles = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "2rem",
  zIndex: 1000,
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};
const overlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  zIndex: 999,
};

function EditTransactionModal({ transaction, onClose, onSave }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [transactionType, setTransactionType] = useState("expense");

  useEffect(() => {
    if (transaction) {
      setTransactionType(transaction.type);
      setCategory(transaction.category);
      // Use 'income' if it's an income type, otherwise 'amount'
      setAmount(
        transaction.type === "income" ? transaction.income : transaction.amount
      );
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSave = () => {
    const updatedTransaction = {
      ...transaction,
      type: transactionType,
      category: transactionType === "income" ? "income" : category,
      amount: transactionType === "expense" ? parseFloat(amount) : 0,
      income: transactionType === "income" ? parseFloat(amount) : 0,
    };
    onSave(updatedTransaction);
  };

  return (
    <>
      <div style={overlayStyles} onClick={onClose} />
      <div style={modalStyles}>
        <h2>Edit Transaction</h2>
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
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleSave}>Save Changes</button>
        <button onClick={onClose} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
    </>
  );
}

export default EditTransactionModal;
