"use client";
import React, { useState } from "react";

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const Calculator = ({ isOpen, onClose }: CalculatorProps) => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForNewValue(true);
    setOperation(op);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "×":
        return prev * current;
      case "÷":
        if (current === 0) {
          alert("Cannot divide by zero");
          return prev;
        }
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-300 w-64">
      <div className="flex items-center justify-between p-3 bg-[#277C72] rounded-t-lg">
        <h3 className="text-white font-semibold">Calculator</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="p-4 bg-gray-100">
        <div className="bg-white p-4 rounded text-right text-2xl font-mono min-h-[60px] flex items-center justify-end overflow-x-auto">
          {display}
        </div>
      </div>

      <div className="p-4 grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button
          onClick={handleClear}
          className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded transition-colors"
        >
          C
        </button>
        <button
          onClick={() => handleOperation("÷")}
          className="bg-[#277C72] hover:bg-[#1f5d54] text-white font-semibold py-3 rounded transition-colors"
        >
          ÷
        </button>
        <button
          onClick={() => handleOperation("×")}
          className="bg-[#277C72] hover:bg-[#1f5d54] text-white font-semibold py-3 rounded transition-colors"
        >
          ×
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleNumber("7")}
          className="bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          7
        </button>
        <button
          onClick={() => handleNumber("8")}
          className="bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          8
        </button>
        <button
          onClick={() => handleNumber("9")}
          className="bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          9
        </button>
        <button
          onClick={() => handleOperation("-")}
          className="bg-[#277C72] hover:bg-[#1f5d54] text-white font-semibold py-3 rounded transition-colors"
        >
          −
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleNumber("4")}
          className="bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          4
        </button>
        <button
          onClick={() => handleNumber("5")}
          className="bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          5
        </button>
        <button
          onClick={() => handleNumber("6")}
          className="bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          6
        </button>
        <button
          onClick={() => handleOperation("+")}
          className="bg-[#277C72] hover:bg-[#1f5d54] text-white font-semibold py-3 rounded transition-colors"
        >
          +
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleNumber("1")}
          className="bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          1
        </button>
        <button
          onClick={() => handleNumber("2")}
          className="bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          2
        </button>
        <button
          onClick={() => handleNumber("3")}
          className="bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          3
        </button>
        <button
          onClick={handleEquals}
          className="row-span-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded transition-colors"
        >
          =
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleNumber("0")}
          className="col-span-2 bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="bg-gray-200 hover:bg-gray-300 font-semibold py-3 rounded transition-colors"
        >
          .
        </button>
      </div>
    </div>
  );
};

export default Calculator;

