// src/screens/AnalyticsPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart,
  Bar,
  Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// (The MyChart and categoryColors components remain exactly the same)
const MyChart = ({ data, visibleCategories }) => {
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

const categoryColors = {
  food: "#8884d8",
  entertainment: "#82ca9d",
  groceries: "#ffc658",
  bills: "#ff8042",
};

function AnalyticsPage() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [chartData, setChartData] = useState([]); // Renamed for clarity
  const [categories, setCategories] = useState([]);

  // Set default start date to the beginning of the month
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 2)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [visibleCategories, setVisibleCategories] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      const { data, error } = await supabase.from("Transactions").select("*");
      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }
      setAllTransactions(data);

      const uniqueCategories = [...new Set(data.map((t) => t.category))];
      setCategories(uniqueCategories);
      let initialVisibility = {};
      uniqueCategories.forEach((cat) => {
        initialVisibility[cat] = true;
      });
      setVisibleCategories(initialVisibility);
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    if (allTransactions.length === 0 || !startDate || !endDate) return;

    // 1. Grouping logic remains the same
    const groupedByDate = allTransactions.reduce((acc, t) => {
      if (!visibleCategories[t.category]) return acc;
      const date = t.date;
      if (!acc[date]) {
        acc[date] = { date };
      }
      acc[date][t.category] = (acc[date][t.category] || 0) + t.amount;
      return acc;
    }, {});

    // --- NEW, TIMEZONE-SAFE LOGIC ---

    // 2. Create a complete date range without mutating state
    let dateRange = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Manually format the date to avoid timezone issues
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      dateRange.push(formattedDate);

      // Safely increment the date of our copy
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 3. Merging logic remains the same
    const finalChartData = dateRange.map((date) => {
      return groupedByDate[date] || { date };
    });

    setChartData(finalChartData);
  }, [allTransactions, startDate, endDate, visibleCategories]);
  const handleCategoryChange = (category) => {
    setVisibleCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const visibleCategoryList = Object.keys(visibleCategories).filter(
    (cat) => visibleCategories[cat]
  );

  return (
    <div>
      <h2>Analytics</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px",
          flexWrap: "wrap",
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
          <strong>Categories:</strong>
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

      <p>Daily spending by category:</p>
      <div style={{ width: "100%", height: 400 }}>
        <MyChart data={chartData} visibleCategories={visibleCategoryList} />
      </div>
    </div>
  );
}

export default AnalyticsPage;
