"use client";
import React, { useEffect, useState } from "react";
import RangeDates from "@/app/Components/EpikiroseisChartComponents/RangeDates";
import Spinner from "./Spinner";
const EpikiroseisTable = () => {
  const [data, setData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("2019-01-01");
  const [endDate, setEndDate] = useState("2023-06-30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/csv_json/_epikiroseis_062023.json`
      );
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
      <p className="text-3xl md:pt-0 pt-5 font-bold text-center text-gray-800">
        Επικυρώσεις Ειστηρίων(2019 - 2023)
      </p>
      <p className="text-gray-600 pb-4 italic text-center">
        Κανε κλικ σε μία γραμμή για να εστιάσεις.
      </p>

      {/* Filter */}
      <RangeDates
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleFilter={handleFilter}
      />

      {/* Table */}
      {loading && <Spinner />}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="max-h-[60vh] overflow-auto border mt-10 border-gray-300 rounded">
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
              {filteredData.map(([date, values], index) => {
                const isEven = index % 2 === 0;
                const isSelected = selectedRow === date;
                const rowBg = isSelected
                  ? "bg-yellow-100 font-bold"
                  : isEven
                  ? "bg-white"
                  : "bg-gray-300";
                const textColor = isEven ? "text-gray-800" : "text-gray-700";

                return (
                  <tr
                    key={date}
                    className={rowBg}
                    onClick={() => setSelectedRow(date)}
                    style={{ cursor: "pointer" }}
                  >
                    <td
                      className={`px-4 py-2 border-b border-gray-300 whitespace-nowrap ${textColor}`}
                    >
                      {date}
                    </td>
                    {columns.slice(1).map((key) => (
                      <td
                        key={key}
                        className={`px-4 py-2 border-b border-gray-300 text-center ${textColor}`}
                      >
                        {values[key] ?? ""}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EpikiroseisTable;
