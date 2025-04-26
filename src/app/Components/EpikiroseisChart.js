"use client";
import React, { useEffect, useState } from "react";
import { Line, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EpikiroseisCharts = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [months, setMonths] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/csv_json/_epikiroseis_062023.json");
      if (!response.ok) throw new Error("JSON not found");
      const json = await response.json();
      const entries = sortByDate(Object.entries(json));
      setFilteredData(entries);
      setMonths([...new Set(entries.map(([date]) => date.split("/").reverse().slice(0, 2).join("-")))].sort());
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
      const parts = dateStr.split("/");
      const current = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      return current >= start && current <= end;
    });

    setFilteredData(filtered);
  };

  const groupByMonth = (entries) => {
    const monthlyData = {};

    entries.forEach(([dateStr, values]) => {
      const [day, month, year] = dateStr.split("/");
      const key = `${year}-${month}`;

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
  const monthData = monthlySummary[selectedMonth] || { ΟΣΥ: 0, ΣΤΑΣΥ: 0, ΤΡΑΜ: 0, ΚΤΕΛ: 0 };

  const lineChartData = {
    labels: filteredData.map(([date]) => date),
    datasets: [
      {
        label: "ΟΣΥ",
        data: filteredData.map(([_, values]) => values["ΟΣΥ"] ?? 0),
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "ΣΤΑΣΥ",
        data: filteredData.map(([_, values]) => values["ΣΤΑΣΥ"] ?? 0),
        borderColor: "#33FF57",
        backgroundColor: "rgba(51, 255, 87, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "ΤΡΑΜ",
        data: filteredData.map(([_, values]) => values["ΤΡΑΜ"] ?? 0),
        borderColor: "#3357FF",
        backgroundColor: "rgba(51, 87, 255, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "ΚΤΕΛ",
        data: filteredData.map(([_, values]) => values["ΚΤΕΛ"] ?? 0),
        borderColor: "#F0E130",
        backgroundColor: "rgba(240, 225, 48, 0.2)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const donutPieData = {
    labels: ["ΟΣΥ", "ΣΤΑΣΥ", "ΤΡΑΜ", "ΚΤΕΛ"],
    datasets: [
      {
        label: `Συνολικά (${selectedMonth || "Select Month"})`,
        data: [monthData["ΟΣΥ"], monthData["ΣΤΑΣΥ"], monthData["ΤΡΑΜ"], monthData["ΚΤΕΛ"]],
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#F0E130"],
      },
    ],
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center text-green-200">
        Επικυρώσεις 1/1/2019 - 30/6/2023
      </h2>

      {/* Date Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700">Από</label>
          <input
            type="date"
            value={startDate}
            placeholder="2019-01-01"
            onChange={(e) => setStartDate(e.target.value)}
            className="appearance-none border px-3 py-2 rounded bg-white text-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Έως</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <button
          onClick={handleFilter}
          className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
        >
          Φίλτρο
        </button>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700">Επιλογή μήνα:</label>
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
        <div className="flex flex-row flex-wrap items-center space-y-4">
          <div className="w-1/3 h-[50vh] mx-auto">
            <Line data={lineChartData} options={{ responsive: true }} />
          </div>

          <div className="w-1/3 h-[50vh] mx-auto">
            <Doughnut data={donutPieData} options={{ responsive: true }} />
          </div>

          <div className="w-1/3 h-[50vh] mx-auto">
            <Pie data={donutPieData} options={{ responsive: true }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EpikiroseisCharts;
