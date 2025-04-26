"use client";
import React, { useEffect, useState } from "react";

const EpikiroseisTable = () => {
  const [data, setData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("2019-01-01");
  const [endDate, setEndDate] = useState("2023-06-30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/csv_json/_epikiroseis_062023.json");
      if (!response.ok) throw new Error("JSON not found");
      const json = await response.json();
      setData(json);
      setFilteredData(sortByDate(Object.entries(json)));
    } catch (err) {
      setError("Failed to load data.");
      console.error("Error fetching JSON:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

    const filtered = sortByDate(Object.entries(data)).filter(([dateStr]) => {
      const parts = dateStr.split("/");
      const current = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      return current >= start && current <= end;
    });

    setFilteredData(filtered);
  };

  // Get columns but exclude the last 4
  const columns =
    filteredData.length > 0
      ? ["Ημερομηνία", ...Object.keys(filteredData[0][1]).slice(0, -4)]
      : [];

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
            min="2019-01-01"
            max="2023-06-30"
            onChange={(e) => {
              const newStartDate = e.target.value;
              setStartDate(newStartDate);
              if (newStartDate > endDate) {
                setEndDate(newStartDate); // Ensure endDate is not before startDate
              }
            }}
            className="appearance-none border px-3 py-2 rounded bg-white text-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Έως</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max="2023-06-30"
            onChange={(e) => setEndDate(e.target.value)}
            className="appearance-none border px-3 py-2 rounded bg-white text-gray-800"
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleFilter}
            className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            Φίλτρο
          </button>
        </div>
      </div>

      {/* Table */}
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="max-h-[500px] overflow-auto border border-gray-300 rounded">
          <table className="min-w-full text-sm text-center border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 border-b font-medium text-gray-700 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map(([date, values], index) => (
                <tr
                  key={date}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                >
                  <td className="px-4 py-2 border-b whitespace-nowrap text-red-500">
                    {date}
                  </td>
                  {columns.slice(1).map((key) => (
                    <td
                      key={key}
                      className="px-4 py-2 border-b text-center text-red-500"
                    >
                      {values[key] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EpikiroseisTable;
