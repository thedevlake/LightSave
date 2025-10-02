import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const mockIncome = 200000;
const mockExpenses = 120000;

const emojiDataset = [
  { emoji: "🏠", keywords: ["house", "home", "household", "apartment"] },
  { emoji: "🚗", keywords: ["car", "vehicle", "drive", "automobile"] },
  { emoji: "🎓", keywords: ["graduation", "education", "school", "degree"] },
  { emoji: "💰", keywords: ["money", "cash", "wealth", "finance", "savings"] },
  { emoji: "✈️", keywords: ["travel", "flight", "plane", "vacation"] },
  { emoji: "📱", keywords: ["phone", "mobile", "smartphone"] },
  { emoji: "🏖️", keywords: ["beach", "holiday", "vacation", "relax"] },
  { emoji: "🚀", keywords: ["rocket", "launch", "space", "fast"] },
];

const suggestIcon = (name) => {
  if (!name) return "";
  const lowerName = name.toLowerCase();
  for (const item of emojiDataset) {
    for (const keyword of item.keywords) {
      if (lowerName.includes(keyword)) {
        return item.emoji;
      }
    }
  }
  return "";
};

const SavingGoals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    icon: "",
    frequency: "Monthly",
    savingsPerPeriod: "",
  });

  const [whatIf, setWhatIf] = useState({
    goalId: null,
    savingsPerPeriod: 0,
    frequency: "Monthly",
    estimatedCompletion: "",
  });
  const [budgetSuggestions, setBudgetSuggestions] = useState([]);

  // Helper function to format number with commas
  const formatNumber = (value) => {
    if (value === "" || value === null || isNaN(value)) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Helper function to parse formatted string to number
  const parseNumber = (value) => {
    if (!value) return "";
    return Number(value.toString().replace(/,/g, ""));
  };

  const handleNewGoalChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "targetAmount" ||
      name === "currentAmount" ||
      name === "savingsPerPeriod"
    ) {
      const numericValue = parseNumber(value);
      if (
        name === "currentAmount" &&
        (numericValue === "" || numericValue < 0)
      ) {
        // For currentAmount min 0
        setNewGoal((prev) => ({ ...prev, [name]: "" }));
      } else if (
        (name === "targetAmount" || name === "savingsPerPeriod") &&
        (numericValue === "" || numericValue < 1)
      ) {
        // For targetAmount and savingsPerPeriod min 1
        setNewGoal((prev) => ({ ...prev, [name]: "" }));
      } else {
        setNewGoal((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else if (name === "icon") {
      setNewGoal((prev) => ({ ...prev, icon: value }));
    } else if (name === "name") {
      setNewGoal((prev) => {
        const suggestedEmoji = suggestIcon(value);
        // Only update icon if user hasn't manually typed one (icon is empty or matches previous suggestion)
        const iconToSet =
          prev.icon === "" ||
          emojiDataset.some(
            (e) =>
              e.emoji === prev.icon &&
              e.keywords.some((k) => prev.name.toLowerCase().includes(k))
          )
            ? suggestedEmoji
            : prev.icon;
        return { ...prev, name: value, icon: iconToSet };
      });
    } else {
      setNewGoal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNewGoalSubmit = (e) => {
    e.preventDefault();
    setGoals((prev) => [...prev, { ...newGoal, id: Date.now() }]);
    setNewGoal({
      name: "",
      targetAmount: "",
      currentAmount: "",
      icon: "",
      frequency: "Monthly",
      savingsPerPeriod: "",
    });
  };

  const calculateEstimatedCompletion = (current, target, perPeriod) => {
    if (perPeriod === 0) return "N/A";
    const periodsLeft = Math.ceil((target - current) / perPeriod);
    return `${periodsLeft} ${newGoal.frequency}(s)`;
  };

  const handleWhatIfOpen = (goal) => {
    setWhatIf({
      goalId: goal.id,
      savingsPerPeriod: goal.savingsPerPeriod,
      frequency: goal.frequency,
      estimatedCompletion: calculateEstimatedCompletion(
        goal.currentAmount,
        goal.targetAmount,
        goal.savingsPerPeriod
      ),
    });
  };

  //   const handleWhatIfChange = (e) => {
  //     const { name, value } = e.target;
  //     setWhatIf((prev) => ({ ...prev, [name]: value }));
  //     const goal = goals.find((g) => g.id === whatIf.goalId);
  //     if (goal) {
  //       const est = calculateEstimatedCompletion(
  //         goal.currentAmount,
  //         goal.targetAmount,
  //         name === "savingsPerPeriod" ? Number(value) : goal.savingsPerPeriod
  //       );
  //       setWhatIf((prev) => ({ ...prev, estimatedCompletion: est }));
  //     }
  //   };

  useEffect(() => {
    setTimeout(() => {
      setBudgetSuggestions([
        {
          id: 1,
          suggestion: `Allocate ₦${Math.max(0, mockIncome - mockExpenses)} for savings this month.`,
        },
        { id: 2, suggestion: "Limit entertainment expenses to ₦20,000." },
        { id: 3, suggestion: "Invest 10% of savings into fixed deposit." },
      ]);
    }, 500);
  }, []);

  return (
    <>
      <style>{`
        /* Remove number input arrows */
        input.no-spin-arrows::-webkit-outer-spin-button,
        input.no-spin-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input.no-spin-arrows[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full min-h-screen px-6 md:px-16 py-10 bg-[#f8f5f0] flex flex-col gap-12"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">Saving Goals</h1>
          <p className="text-gray-600 mt-1">
            Track, plan, and achieve your dreams with confidence.
          </p>
        </div>
        <hr className="border-t border-gray-300" />

        {/* Goal Creation */}
        <section className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6 w-full">
          <h2 className="text-xl font-semibold text-black">
            Create a New Goal
          </h2>
          <form
            onSubmit={handleNewGoalSubmit}
            className="flex flex-wrap gap-4 w-full"
          >
            <input
              type="text"
              name="name"
              placeholder="Enter goal name (e.g., Buy a Car)"
              value={newGoal.name}
              onChange={handleNewGoalChange}
              className="w-full md:w-1/5 px-5 py-4 rounded-full border border-gray-300 placeholder-gray-500 text-black"
              required
            />
            <input
              type="text"
              name="targetAmount"
              placeholder="Target amount in ₦ (e.g., 500000)"
              value={formatNumber(newGoal.targetAmount)}
              onChange={handleNewGoalChange}
              className="no-spin-arrows w-full md:w-1/6 px-5 py-4 rounded-full border border-gray-300 placeholder-gray-500 text-black"
              required
            />
            <input
              type="text"
              name="currentAmount"
              placeholder="Current saved in ₦ (e.g., 50000)"
              value={formatNumber(newGoal.currentAmount)}
              onChange={handleNewGoalChange}
              className="no-spin-arrows w-full md:w-1/6 px-5 py-4 rounded-full border border-gray-300 placeholder-gray-500 text-black"
            />
            <input
              type="text"
              name="icon"
              placeholder="Emoji icon (e.g., 🏠)"
              value={newGoal.icon}
              onChange={handleNewGoalChange}
              className="w-full md:w-1/6 px-5 py-4 rounded-full border border-gray-300 text-black bg-gray-50"
            />
            <select
              name="frequency"
              value={newGoal.frequency}
              onChange={handleNewGoalChange}
              className="w-full md:w-1/6 px-5 py-4 rounded-full border border-gray-300 text-black bg-gray-50"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
            <input
              type="text"
              name="savingsPerPeriod"
              placeholder="Amount to save per period in ₦"
              value={formatNumber(newGoal.savingsPerPeriod)}
              onChange={handleNewGoalChange}
              className="no-spin-arrows w-full md:w-1/6 px-5 py-4 rounded-full border border-gray-300 placeholder-gray-500 text-black"
              required
            />
            <button
              type="submit"
              className="bg-[#1b5e20] hover:bg-green-800 text-white px-6 py-4 rounded-full font-semibold"
            >
              Add Goal
            </button>
          </form>
        </section>

        <hr className="border-t border-gray-300" />

        {/* Goals List */}
        <section className="flex flex-col gap-8 w-full">
          {goals.length === 0 ? (
            <div className="text-center text-gray-400 italic py-8">
              No goals yet. Add your first goal above!
            </div>
          ) : (
            goals.map((goal) => {
              const percent = Math.min(
                100,
                Math.round((goal.currentAmount / goal.targetAmount) * 100)
              );
              const estimatedCompletion = calculateEstimatedCompletion(
                goal.currentAmount,
                goal.targetAmount,
                goal.savingsPerPeriod
              );
              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-10 w-full"
                >
                  {/* Left: Icon/Info */}
                  <div className="flex items-center gap-6">
                    <span className="text-5xl">{goal.icon || "💳"}</span>
                    <div>
                      <h3 className="text-xl font-bold text-black">
                        {goal.name}
                      </h3>
                      <p className="text-gray-600">
                        Target: ₦{goal.targetAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Center: Progress Ring */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-24 h-24">
                      <svg className="absolute inset-0" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#e5e7eb"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="url(#gradient)"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - percent / 100)}`}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 0.6s" }}
                        />
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#1b5e20" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-black">
                        {percent}%
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Saved ₦{goal.currentAmount.toLocaleString()}
                    </p>
                  </div>

                  {/* Right: Insights & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-gray-800 text-sm">
                      Est. Completion: <b>{estimatedCompletion}</b>
                    </span>
                    <span className="text-gray-700 text-sm">
                      Saving ₦{goal.savingsPerPeriod}/{goal.frequency}
                    </span>
                    <button
                      className="text-[#1b5e20] hover:underline text-sm font-semibold"
                      onClick={() => handleWhatIfOpen(goal)}
                    >
                      What if I save more?
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>

        <hr className="border-t border-gray-300" />

        {/* Budget Suggestions */}
        <section className="bg-white rounded-3xl shadow-xl p-8 w-full flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-black">
            Budget Suggestions
          </h2>
          {budgetSuggestions.length === 0 ? (
            <div className="text-gray-400 italic">Loading suggestions...</div>
          ) : (
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {budgetSuggestions.map((s) => (
                <li key={s.id}>{s.suggestion}</li>
              ))}
            </ul>
          )}
        </section>
      </motion.div>
    </>
  );
};

export default SavingGoals;
