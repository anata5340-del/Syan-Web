import React, { useState } from "react";

const Calendar = () => {
  // State to manage the current date (initially set to today's date)
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper function to get the start of the week (Sunday)
  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek;
  };

  // Generate the week dates dynamically
  const generateWeekDates = (startOfWeek) => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  // Helper function to check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Current week's start and week dates
  const startOfWeek = getStartOfWeek(currentDate);
  const weekDates = generateWeekDates(startOfWeek);

  // Get current month and year
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  // Navigation functions
  const navigateToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7); // Move 7 days back
    setCurrentDate(newDate);
  };

  const navigateToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7); // Move 7 days forward
    setCurrentDate(newDate);
  };

  // const navigateToPreviousMonth = () => {
  //   const newDate = new Date(currentDate);
  //   newDate.setMonth(currentDate.getMonth() - 1); // Move to the previous month
  //   setCurrentDate(newDate);
  // };

  // const navigateToNextMonth = () => {
  //   const newDate = new Date(currentDate);
  //   newDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
  //   setCurrentDate(newDate);
  // };

  return (
    <div className="bg-gray-100 rounded-lg p-5 shadow-md">
      {/* Header with month and year */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="text-teal-700"
          onClick={navigateToPreviousWeek} // Navigate to the previous month
        >
          <span>&lt;</span>
        </button>
        <h2 className="text-lg font-bold">{`${currentMonth} ${currentYear}`}</h2>
        <button
          className="text-teal-700"
          onClick={navigateToNextWeek} // Navigate to the next month
        >
          <span>&gt;</span>
        </button>
      </div>
      {/* Dates of the week */}
      <div className="grid grid-cols-7 text-center">
        {weekDates.map((date, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center p-2 rounded-full ${
              isToday(date)
                ? "bg-black text-white"
                : "bg-transparent text-gray-900"
            }`}
          >
            {/* Weekday (e.g., T for Tuesday) */}
            <span
              className={`text-xs pb-2 ${
                isToday(date) ? "text-white" : "text-gray-600"
              }`}
            >
              {["S", "M", "T", "W", "T", "F", "S"][date.getDay()]}
            </span>
            {/* Date */}
            <span
              className={`text-sm size-5 rounded-full ${
                isToday(date) ? "bg-teal-500 text-white" : "bg-white "
              }`}
            >
              {date.getDate()}
            </span>
          </div>
        ))}
      </div>
      {/* Week navigation */}
      {/* <div className="flex justify-between mt-4">
        <button
          className="text-teal-700"
          onClick={navigateToPreviousWeek} // Navigate to the previous week
        >
          Previous Week
        </button>
        <button
          className="text-teal-700"
          onClick={navigateToNextWeek} // Navigate to the next week
        >
          Next Week
        </button>
      </div> */}
    </div>
  );
};

export default Calendar;
