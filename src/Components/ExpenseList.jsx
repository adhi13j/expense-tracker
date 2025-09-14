// src/components/ExpenseList.jsx

// 1. Receive 'transactions' as a prop
function ExpenseList({ transactions, onEdit, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return <p>No transactions added yet.</p>;
  }
  const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    borderBottom: "1px solid #eee",
  };

  const buttonStyle = {
    marginLeft: "10px",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontSize: "16px",
  };

  return (
    <div>
      <ul>
        {transactions
          .slice()
          .reverse()
          .map((transaction) => (
            <li key={transaction.id} style={listItemStyle}>
              <div>
                <span>
                  {transaction.type === "expense"
                    ? transaction.category
                    : "income"}
                  :{" "}
                </span>
                <span
                  style={{
                    color: transaction.type === "income" ? "green" : "red",
                  }}
                >
                  $
                  {transaction.type === "income"
                    ? transaction.income.toFixed(2)
                    : transaction.amount.toFixed(2)}
                </span>
              </div>
              <div>
                <button onClick={() => onEdit(transaction)} style={buttonStyle}>
                  📝
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
                  style={buttonStyle}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
