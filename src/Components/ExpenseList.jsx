// src/components/ExpenseList.jsx

// 1. Receive 'transactions' as a prop
function ExpenseList({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return <p>No transactions added yet.</p>;
  }

  return (
    <div>
      <ul>
        {/* 2. Map over the 'transactions' array */}

        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <span>{transaction.income == 0?  transaction.category:"income"}: </span>
            <span>${transaction.income == 0? transaction.amount.toFixed(2) : transaction.income}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
