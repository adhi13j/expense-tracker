import React from "react";

function WalletBalance({ balance }) {
  return (
    <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-indigo-200">Current Balance</h3>
      <p className="text-4xl font-bold mt-2">
        $
        {balance.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  );
}

export default WalletBalance;
