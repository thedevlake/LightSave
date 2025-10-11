import React, { useState } from "react";

const TransactionPage = ({ transactions }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, 5);

  return (
    <div className="shadow-xl rounded-lg p-6 mt-6 w-full bg-[#f8f5f0] dark:bg-gradient-to-r from-[#0D9488] to-[#134E4A] bg-clip-text">
      <h2 className="text-3xl font-semibold mb-6 text-[#1b5e20] dark:text-white">
        Cash Flow Overview
      </h2>

      <div className="overflow-x-auto">
        <table
          className="w-full text-left border-separate"
          style={{ borderSpacing: 0 }}
        >
          <thead>
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.map(
              (
                { id, date, description, category, amount, currency, type },
                idx
              ) => (
                <tr
                  key={id}
                  className={
                    idx % 2 === 0
                      ? "bg-[#fafafa] dark:bg-white/70 dark:text-black"
                      : "bg-[#f0f0f0] dark:bg-white/50 dark:text-black"
                  }
                >
                  <td className="px-6 py-4">
                    {new Date(date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{description}</td>
                  <td className="px-6 py-4">{category}</td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${
                      type === "income"
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-600 dark:text-red-800"
                    }`}
                  >
                    {type === "income" ? "+" : "-"} {currency}{" "}
                    {Number(amount).toLocaleString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="px-7 py-3 rounded-xl font-semibold shadow-sm transition-all text-xs"
          style={{
            background: "linear-gradient(90deg, #2e7d32 0%, #3fa688 100%)",
            color: "#ffffff",
          }}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "See Less" : "See More"}
        </button>
      </div>
    </div>
  );
};

export default TransactionPage;
