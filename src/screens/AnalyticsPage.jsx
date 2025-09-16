import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../contexts/ThemeContext";
import {
  BarChart,
  Bar,
  AreaChart,
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

const categoryColors = {
  food: "#8884d8",
  entertainment: "#82ca9d",
  groceries: "#ffc658",
  bills: "#ff8042",
  shopping: "#ff7300",
  transport: "#0088fe",
  health: "#d0ed57",
  other: "#a4de6c",
  income: "#22c55e",
};

const DailyExpenseChart = ({ data, visibleCategories }) => {
  const { theme } = useTheme();
  const axisColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  const tooltipBg = theme === "dark" ? "#1e293b" : "#ffffff";

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="date" stroke={axisColor} />
        <YAxis stroke={axisColor} />
        <Tooltip
          contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor }}
        />
        <Legend wrapperStyle={{ color: axisColor }} />
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

const CategoryPieChart = ({ data }) => {
  const colors = data.map((entry) => categoryColors[entry.name] || "#8884d8");
  return (
    <ResponsiveContainer width="100%" height={400}>
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

const NetWalletChart = ({ data }) => {
  const { theme } = useTheme();
  const axisColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  const tooltipBg = theme === "dark" ? "#1e293b" : "#ffffff";

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="date" stroke={axisColor} />
        <YAxis stroke={axisColor} />
        <Tooltip
          contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor }}
        />
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

  useEffect(() => {
    const fetchData = async () => {
      const { data: walletData, error: walletError } = await supabase
        .from("Wallet")
        .select("*")
        .order("date");
      const { data: transactionsData, error: transactionsError } =
        await supabase.from("Transactions").select("*").order("date");

      if (walletError)
        console.error("Error fetching wallet history:", walletError);
      if (transactionsError)
        console.error("Error fetching transactions:", transactionsError);

      setAllTransactions(transactionsData || []);
      setWalletHistory(walletData || []);

      const uniqueCategories = [
        ...new Set(
          (transactionsData || [])
            .filter((t) => t.type === "expense")
            .map((t) => t.category)
        ),
      ];
      setCategories(uniqueCategories);

      const initialVisibility = uniqueCategories.reduce((acc, cat) => {
        acc[cat] = true;
        return acc;
      }, {});
      setVisibleCategories(initialVisibility);
    };

    fetchData();
  }, []);

  const { timelineExpenseData, formattedPieData, walletTimelineData } =
    useMemo(() => {
      const toYYYYMMDD = (date) => date.toISOString().slice(0, 10);
      const startString = toYYYYMMDD(startDate);
      const endString = toYYYYMMDD(endDate);

      const filteredTransactions = allTransactions.filter(
        (t) => t.date >= startString && t.date <= endString
      );

      const dailyExpenseData = filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => {
          if (!acc[t.date]) acc[t.date] = { date: t.date };
          acc[t.date][t.category] = (acc[t.date][t.category] || 0) + t.amount;
          return acc;
        }, {});

      const timelineExpenseData = Object.values(dailyExpenseData);

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

      const walletTimelineData = walletHistory.filter(
        (d) => d.date >= startString && d.date <= endString
      );

      return { timelineExpenseData, formattedPieData, walletTimelineData };
    }, [allTransactions, walletHistory, startDate, endDate]);

  const getBudgetingTip = async () => {
    if (formattedPieData.length === 0) {
      setAiSuggestion(
        "Not enough data for a suggestion. Please add some expenses."
      );
      return;
    }
    setIsLoadingAi(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "ai-budget-tips",
        { body: { pieChartData: formattedPieData } }
      );
      if (error) throw error;
      setAiSuggestion(data.suggestion);
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
      setAiSuggestion("Could not fetch a suggestion at this time.");
    }
    setIsLoadingAi(false);
  };

  const handleCategoryChange = (category) => {
    setVisibleCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const visibleCategoryList = Object.keys(visibleCategories).filter(
    (cat) => visibleCategories[cat]
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
        Analytics Dashboard
      </h2>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <strong className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Date Range:
          </strong>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="w-32 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <span className="text-slate-500 dark:text-slate-400">to</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="w-32 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={visibleCategories[cat] || false}
                onChange={() => handleCategoryChange(cat)}
                className="form-checkbox h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              />
              <span className="ml-2 text-slate-700 dark:text-slate-300">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Daily Spending by Category
          </h3>
          <DailyExpenseChart
            data={timelineExpenseData}
            visibleCategories={visibleCategoryList}
          />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Net Wallet Balance Over Time
          </h3>
          <NetWalletChart data={walletTimelineData} />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg lg:col-span-2">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Expense Breakdown by Category
          </h3>
          <CategoryPieChart data={formattedPieData} />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg lg:col-span-2 text-center">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
            AI Budgeting Helper
          </h3>
          <button
            onClick={getBudgetingTip}
            disabled={isLoadingAi}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors disabled:bg-slate-400"
          >
            {isLoadingAi ? "Thinking..." : "Get AI Tip"}
          </button>
          {aiSuggestion && (
            <p className="mt-4 text-slate-600 dark:text-slate-300 italic max-w-2xl mx-auto">
              <strong>AI Says:</strong> {aiSuggestion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
