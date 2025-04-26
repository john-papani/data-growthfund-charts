"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Area,
  BarChart,
  Cell,
  Bar,
  ComposedChart,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F0E130"];

const EpikiroseisCharts = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("2019-01-01");
  const [endDate, setEndDate] = useState("2019-01-30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [months, setMonths] = useState([]);

  useEffect(() => {
    load();
    generateMonths(startDate, endDate);
  }, []);

  const generateMonths = (start, end) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const result = [];

    startD.setDate(1); // normalize to the first of the month

    while (startD <= endD) {
      const year = startD.getFullYear();
      const month = String(startD.getMonth() + 1).padStart(2, "0");
      result.push(`${year}-${month}`);
      startD.setMonth(startD.getMonth() + 1);
    }

    setMonths(result);
  };

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/csv_json/_epikiroseis_062023.json");
      if (!response.ok) throw new Error("JSON not found");
      const json = await response.json();
      const entries = sortByDate(Object.entries(json));

      const start = new Date(startDate);
      const end = new Date(endDate);

      const filtered = entries.filter(([dateStr]) => {
        const [day, month, year] = dateStr.split("/");
        const current = new Date(`${year}-${month}-${day}`);
        return current >= start && current <= end;
      });

      setFilteredData(filtered);
    } catch (err) {
      setError("Failed to load data.");
      console.error("Error fetching JSON:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortByDate = (entries) => {
    return entries.sort((a, b) => {
      const dateA = new Date(a[0].split("/").reverse().join("-"));
      const dateB = new Date(b[0].split("/").reverse().join("-"));
      return dateA - dateB;
    });
  };

  const handleFilter = () => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = sortByDate(filteredData).filter(([dateStr]) => {
      const [day, month, year] = dateStr.split("/");
      const current = new Date(`${year}-${month}-${day}`);
      return current >= start && current <= end;
    });

    console.log(start, end, filtered);
    setFilteredData(filtered);
    load();
  };

  const groupByMonth = (entries) => {
    const monthlyData = {};

    entries.forEach(([dateStr, values]) => {
      const [day, month, year] = dateStr.split("/");
      const key = `${year}-${month.padStart(2, "0")}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { ΟΣΥ: 0, ΣΤΑΣΥ: 0, ΤΡΑΜ: 0, ΚΤΕΛ: 0 };
      }

      monthlyData[key]["ΟΣΥ"] += values["ΟΣΥ"] ?? 0;
      monthlyData[key]["ΣΤΑΣΥ"] += values["ΣΤΑΣΥ"] ?? 0;
      monthlyData[key]["ΤΡΑΜ"] += values["ΤΡΑΜ"] ?? 0;
      monthlyData[key]["ΚΤΕΛ"] += values["ΚΤΕΛ"] ?? 0;
    });

    return monthlyData;
  };

  const monthlySummary = groupByMonth(filteredData);
  const monthData = monthlySummary[selectedMonth] || {
    ΟΣΥ: 0,
    ΣΤΑΣΥ: 0,
    ΤΡΑΜ: 0,
    ΚΤΕΛ: 0,
  };

  const chartData = filteredData.map(([date, values]) => ({
    date,
    ΟΣΥ: values["ΟΣΥ"] ?? 0,
    ΣΤΑΣΥ: values["ΣΤΑΣΥ"] ?? 0,
    ΤΡΑΜ: values["ΤΡΑΜ"] ?? 0,
    ΚΤΕΛ: values["ΚΤΕΛ"] ?? 0,
  }));

  const pieData = [
    { name: "ΟΣΥ", value: monthData["ΟΣΥ"] },
    { name: "ΣΤΑΣΥ", value: monthData["ΣΤΑΣΥ"] },
    { name: "ΤΡΑΜ", value: monthData["ΤΡΑΜ"] },
    { name: "ΚΤΕΛ", value: monthData["ΚΤΕΛ"] },
  ].filter((entry) => entry.value !== 0);

  const [visibleBars, setVisibleBars] = useState({
    ΟΣΥ: true,
    ΣΤΑΣΥ: true,
    ΤΡΑΜ: true,
    ΚΤΕΛ: true,
  });

  const handleCheckboxChange = (key) => {
    setVisibleBars((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center">
        Επικυρώσεις 1/1/2019 - 30/6/2023
      </h2>

      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-red-700">Από</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-500">
            Έως
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <button
          onClick={handleFilter}
          className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
        >
          Φίλτρο
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-amber-500">Επιλογή μήνα:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">-- Επιλογή --</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div>
          <div className="w-fit md:w-2/3 h-[50vh]">
            <ResponsiveContainer>
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
              >
                <XAxis dataKey="date" />
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis
                  tickFormatter={(value) => value.toLocaleString("el-GR")}
                />
                <Tooltip formatter={(value) => value.toLocaleString("el-GR")} />
                <Legend />
                <Line type="monotone" dataKey="ΤΡΑΜ" stroke="#8884d8" />
                <Area
                  type="monotone"
                  dataKey="ΣΤΑΣΥ"
                  fill="#684814"
                  stroke="#684814"
                />
                <Bar dataKey="ΟΣΥ" barSize={20} fill="#0f52ba" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/3 h-[50vh]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  label={({ name, value }) =>
                    `${name}: ${value.toLocaleString("el-GR")}`
                  }
                  labelLine
                  legendType="diamond"
                >
                  {console.log(monthlySummary)}
                  {console.log(monthData)}
                  {pieData.map(
                    (entry, index) =>
                      entry.value > 0 && (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                  )}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString("el-GR")} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpikiroseisCharts;
