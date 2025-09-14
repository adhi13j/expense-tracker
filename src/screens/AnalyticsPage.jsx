// src/screens/AnalyticsPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart, // For the daily expenses
  Bar,
  AreaChart, // For the wallet balance
  Area,
  PieChart,
  Pie,
  Cell,
  Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Chart 1: Daily STACKED BAR chart for expenses
const DailyExpenseChart = ({ data, visibleCategories }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Brush dataKey="date" height={30} stroke="#8884d8" />
        {visibleCategories.map((category) => (
          <Bar
            key={category}
            dataKey={category}
            stackId="a"
            fill={categoryColors[category] || "#8884d8"}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

// Chart 2: PIE chart for expense category breakdown
const CategoryPieChart = ({ data }) => {
  const colors = data.map((entry) => categoryColors[entry.name] || "#8884d8");
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Chart 3: AREA chart for the net wallet balance
const NetWalletChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Brush dataKey="date" height={30} stroke="#82ca9d" />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const categoryColors = {
  food: "#8884d8",
  entertainment: "#82ca9d",
  groceries: "#ffc658",
  bills: "#ff8042",
};

function AnalyticsPage() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [walletHistory, setWalletHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState({});
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());


  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const getBudgetingTip = async () => {
    setIsLoadingAi(true);
    try {
      // This calls the function you just deployed
      const { data, error } = await supabase.functions.invoke(
        "ai-budget-tips",
        {
          body: { pieChartData: formattedPieData },
        }
      );

      if (error) throw error;

      setAiSuggestion(data.suggestion);
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
      setAiSuggestion("Could not fetch a suggestion at this time.");
    }
    setIsLoadingAi(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: walletData } = await supabase.from("Wallet").select("*");
      const { data: transactions } = await supabase
        .from("Transactions")
        .select("*");

      setAllTransactions(transactions || []);
      setWalletHistory(walletData || []);

      const uniqueCategories = [
        ...new Set(
          (transactions || [])
            .filter((t) => t.type === "expense")
            .map((t) => t.category)
        ),
      ];
      setCategories(uniqueCategories);
      let initialVisibility = {};
      uniqueCategories.forEach((cat) => {
        initialVisibility[cat] = true;
      });
      setVisibleCategories(initialVisibility);
    };

    fetchData();
  }, []);

  const toYYYYMMDD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const startString = toYYYYMMDD(startDate);
  const endString = toYYYYMMDD(endDate);

  const filteredTransactions = allTransactions.filter(
    (t) => t.date >= startString && t.date <= endString
  );

  // Data for Chart 1 (Daily Expenses)
  const dailyExpenseData = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      if (!acc[t.date]) acc[t.date] = { date: t.date };
      acc[t.date][t.category] = (acc[t.date][t.category] || 0) + t.amount;
      return acc;
    }, {});
  const timelineExpenseData = Object.values(dailyExpenseData);

  // Data for Chart 2 (Pie Chart)
  const pieChartData = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  const formattedPieData = Object.keys(pieChartData).map((key) => ({
    name: key,
    value: pieChartData[key],
  }));

  // Data for Chart 3 (Wallet Balance)
  const walletTimelineData = walletHistory.filter(
    (d) => d.date >= startString && d.date <= endString
  );

  const handleCategoryChange = (category) => {
    setVisibleCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const visibleCategoryList = Object.keys(visibleCategories).filter(
    (cat) => visibleCategories[cat]
  );

  return (
    <div>
      <h2>Analytics Dashboard</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "20px",
          flexWrap: "wrap",
          borderBottom: "1px solid #eee",
        }}
      >
        <div>
          <strong>Date Range:</strong>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
          <span> to </span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>
        <div>
          <strong>Expense Categories (for Daily Expense Chart):</strong>
          {categories.map((cat) => (
            <label key={cat} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                checked={visibleCategories[cat] || false}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Daily Spending by Category</h3>
        <div style={{ width: "100%", height: 400 }}>
          <DailyExpenseChart
            data={timelineExpenseData}
            visibleCategories={visibleCategoryList}
          />
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>Net Wallet Balance Over Time</h3>
        <div style={{ width: "100%", height: 400 }}>
          <NetWalletChart data={walletTimelineData} />
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>Expense Breakdown by Category</h3>
        <div style={{ width: "100%", height: 400 }}>
          <CategoryPieChart data={formattedPieData} />
        </div>
      </div>
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h3>AI Budgeting Helper</h3>
        <button onClick={getBudgetingTip} disabled={isLoadingAi}>
          {isLoadingAi ? "Thinking..." : "Get AI Tip"}
        </button>
        {aiSuggestion && (
          <p
            style={{
              marginTop: "10px",
              fontStyle: "italic",
              fontSize: "1.1em",
            }}
          >
            <strong>AI Says:</strong> {aiSuggestion}
          </p>
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;
