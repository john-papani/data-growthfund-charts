
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function RangeDates({startDate, endDate, setStartDate, setEndDate, handleFilter}) {
  console.log("startDate", startDate);
  console.log("endDate", endDate);
  console.log("setStartDate", setStartDate);  
  return (
    <div>
      {" "}
      <div className="hidden lg:flex flex-wrap gap-4 justify-center items-end">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Από</label>
          <DatePicker
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            showIcon
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy" // Format as DD-MM-YYYY
            selectsStart
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            placeholderText="DD-MM-YYYY"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Έως</label>
          <DatePicker
            selected={endDate}
            showIcon
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy" // Format as DD-MM-YYYY
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            placeholderText="DD-MM-YYYY"
          >
            <div style={{ color: "red" }}>
              Προσοχή, η ημερομηνία πρέπει να είναι μετά την ημερομηνία έναρξης.
            </div>
          </DatePicker>
        </div>
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700 transition"
        >
          Εφαρμογή Φίλτρου
        </button>
      </div>
    </div>
  );
}

export default RangeDates;
