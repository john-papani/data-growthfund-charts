"use client";
import React, { useEffect, useState } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
  Area,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";

import RangeDates from "@/app/Components/EpikiroseisChartComponents/RangeDates";

const EpikiroseisCharts = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("2019-01-01");
  const [endDate, setEndDate] = useState("2019-01-15");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [visibleBars, setVisibleBars] = useState({
    ΟΣΥ: true,
    ΣΤΑΣΥ: true,
    ΤΡΑΜ: true,
    ΚΤΕΛ: true,
  });

  useEffect(() => {
    load();
  }, []);

  const router = useRouter();



  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("./csv_json/_epikiroseis_062023.json");
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
      console.error(err);
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

    if (end <= start) {
      alert("The end date must be after the start date.");
      return;
    }

    load();
  };

  const chartData = filteredData.map(([date, values]) => ({
    date,
    ΟΣΥ: values["ΟΣΥ"] ?? 0,
    ΣΤΑΣΥ: values["ΣΤΑΣΥ"] ?? 0,
    ΤΡΑΜ: values["ΤΡΑΜ"] ?? 0,
    ΚΤΕΛ: values["ΚΤΕΛ"] ?? 0,
  }));

  const handleCheckboxChange = (key) => {
    setVisibleBars((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isLongRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end - start;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays > 60;
  };

  return (
    <div className="min-h-screen md:p-6 flex flex-col gap-8">
      <div className="fixed inset-0 bg-black/90 bg-opacity-10 flex justify-center items-center z-50 md:hidden">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Συγγνώμη!</h2>
          <p className="text-gray-600 mb-6">
            Αυτή η σελίδα είναι διαθέσιμη μόνο σε υπολογιστή.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Επιστροφή στην Αρχική
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:pt-0 pt-5 font-bold text-center text-gray-800">
        Επικυρώσεις Ειστηρίων (2019 - 2023)
      </h1>
      <div className="flex flex-col justify-center items-center gap-2">
        <p className="text-gray-600 text-center w-[90%] md:w-[70%] mx-auto">
          Η εφαρμογή αυτή παρέχει πληροφορίες σχετικά με τις επικυρώσεις των
          ειστηρίων του δικτύου συγκοινωνιών της Αθήνας.
        </p>
        <p className="text-gray-600 text-center w-[90%] md:w-[70%] mx-auto">
          Μπορείτε να δείτε τον πίνακα με τα αναλυτικά δεδομένα επικυρώσεων{" "}
          <a
            href="/epikiroseistable"
            className="text-blue-600 hover:underline font-medium"
          >
            εδώ
          </a>
          .
        </p>
      </div>

      {/* Filter */}
      <RangeDates
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleFilter={handleFilter}
      />

      {/* Loading/Error */}
      {loading && (
        <p className="text-center text-gray-500">Φόρτωση δεδομένων...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Chart & Options */}
      {!loading && !error && (
        <div className="flex flex-wrap md:flex-row flex-col justify-center items-center gap-4">
          {/* Options */}
          <div className="flex flex-col p-4 bg-white rounded-xl shadow-md h-fit">
            <h2 className="text-lg font-semibold text-gray-700">
              Επιλογή Δεδομένων
            </h2>
            {Object.keys(visibleBars).map((key) => (
              <label
                key={key}
                className="flex items-center gap-2 text-gray-600"
              >
                <input
                  type="checkbox"
                  checked={visibleBars[key]}
                  onChange={() => handleCheckboxChange(key)}
                  className="accent-blue-600"
                />
                <span className="text-sm">{key}</span>
              </label>
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1 h-[50vh] w-full bg-white rounded-xl shadow-md p-4">
            {/* {chartData[0] && (
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                {isLongRange()
                  ? "Επικυρώσεις ανά μήνα (2019 - 2023)"
                  : `Επικυρώσεις ανά ημέρα (${startDate} - ${endDate})`}
              </h2>
            )} */}

            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  tickFormatter={(v) => v.toLocaleString("el-GR")}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip formatter={(v) => v.toLocaleString("el-GR")} />
                <Legend />

                {!isLongRange() && visibleBars["ΟΣΥ"] && (
                  <Bar dataKey="ΟΣΥ" fill="#60A5FA" />
                )}
                {!isLongRange() && visibleBars["ΣΤΑΣΥ"] && (
                  <Bar dataKey="ΣΤΑΣΥ" fill="#34D399" />
                )}
                {!isLongRange() && visibleBars["ΤΡΑΜ"] && (
                  <Bar dataKey="ΤΡΑΜ" fill="#FBBF24" />
                )}
                {!isLongRange() && visibleBars["ΚΤΕΛ"] && (
                  <Bar dataKey="ΚΤΕΛ" fill="#F87171" />
                )}
                {isLongRange() && visibleBars["ΟΣΥ"] && (
                  <Area
                    dataKey="ΟΣΥ"
                    type="natural"
                    stroke="#60A5FA"
                    fill="red"
                  />
                )}
                {isLongRange() && visibleBars["ΣΤΑΣΥ"] && (
                  <Area
                    dataKey="ΣΤΑΣΥ"
                    type="natural"
                    stroke="#34D399"
                    fill="#34D399"
                  />
                )}
                {isLongRange() && visibleBars["ΤΡΑΜ"] && (
                  <Area
                    dataKey="ΤΡΑΜ"
                    type="natural"
                    stroke="#FBBF24"
                    fill="#FBBF24"
                  />
                )}
                {isLongRange() && visibleBars["ΚΤΕΛ"] && (
                  <Area
                    type="natural"
                    dataKey="ΚΤΕΛ"
                    fill="#684814"
                    stroke="#684814"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpikiroseisCharts;
