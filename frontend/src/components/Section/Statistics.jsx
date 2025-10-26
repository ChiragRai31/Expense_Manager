import React, { useMemo, useState } from "react";
import NavBar from "../NavBar";
import Sidebar from "../Sidebar";
import { Card, CardContent } from "../ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";
import { Input } from "../ui/input";
import { Calendar } from "lucide-react";

const COLORS = [
  "#C84B31",
  "#E05C27",
  "#F6B344",
  "#FBD46D",
  "#5DBB63",
  "#3CAEA3",
  "#2E94B9",
  "#826AED",
];

const Statistics = () => {
  const { expenses } = useSelector((state) => state.expense);
  const [chartType, setChartType] = useState("pie");
  const [sortOrder, setSortOrder] = useState("amount");
  const [filterText, setFilterText] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM"));

  // === Split expenses & incomes ===
  const { expenseData, incomeData, totalExpense, totalIncome } = useMemo(() => {
    const categoryExpense = {};
    const categoryIncome = {};

    expenses.forEach((item) => {
      const month = dayjs(item.date).format("YYYY-MM");
      if (month !== selectedDate) return;

      const cat = item.category || "Others";
      const amt = Number(item.amount) || 0;

      if (amt >= 0) {
        // expense
        if (!categoryExpense[cat]) categoryExpense[cat] = 0;
        categoryExpense[cat] += amt;
      } else {
        // income
        if (!categoryIncome[cat]) categoryIncome[cat] = 0;
        categoryIncome[cat] += Math.abs(amt);
      }
    });

    // Convert to arrays
    let expenseData = Object.entries(categoryExpense).map(([name, value]) => ({
      name,
      value,
    }));
    let incomeData = Object.entries(categoryIncome).map(([name, value]) => ({
      name,
      value,
    }));

    // Filter
    if (filterText.trim()) {
      const match = (r) =>
        r.name.toLowerCase().includes(filterText.toLowerCase());
      expenseData = expenseData.filter(match);
      incomeData = incomeData.filter(match);
    }

    // Sort
    const sorter =
      sortOrder === "amount"
        ? (a, b) => b.value - a.value
        : (a, b) => a.name.localeCompare(b.name);

    expenseData.sort(sorter);
    incomeData.sort(sorter);

    const totalExpense = expenseData.reduce((s, d) => s + d.value, 0);
    const totalIncome = incomeData.reduce((s, d) => s + d.value, 0);

    return { expenseData, incomeData, totalExpense, totalIncome };
  }, [expenses, selectedDate, sortOrder, filterText]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf5]">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* ===== Header ===== */}
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">
              Statistics & Analysis
            </h1>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-500" />
                <input
                  type="month"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded px-2 py-1 text-gray-700"
                />
              </div>

              <Input
                placeholder="Filter category name"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-[250px]"
              />
            </div>

            {/* ===== Chart Settings ===== */}
            <Card className="mb-6">
              <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Categorical Analysis</h3>
                  <p className="text-sm text-gray-500">
                    Visualize your income and expense distribution
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  {/* Chart Type */}
                  <Select onValueChange={setChartType} value={chartType}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Chart Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {/* Sort Order */}
                  <Select onValueChange={setSortOrder} value={sortOrder}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="amount">Amount</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* ===== EXPENSE CHART ===== */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="font-semibold text-xl text-red-700 mb-4">
                  Expense Distribution
                </h2>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Total Expense: ₹{totalExpense.toLocaleString()}
                    </h3>
                    <ul className="text-gray-600 text-sm space-y-1">
                      {expenseData.map((d, i) => (
                        <li key={d.name} className="flex items-center gap-2">
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          ></span>
                          {d.name}: ₹{d.value.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right chart */}
                  <div className="flex-1 h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "pie" ? (
                        <PieChart>
                          <Pie
                            data={expenseData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            dataKey="value"
                          >
                            {expenseData.map((entry, index) => (
                              <Cell
                                key={`exp-cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                          <Legend />
                        </PieChart>
                      ) : (
                        <BarChart data={expenseData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(v) => `₹${v.toLocaleString()}`}
                            labelFormatter={(name) => `Category: ${name}`}
                          />
                          <Legend />
                          <ReferenceLine y={0} stroke="#999" />
                          <Bar dataKey="value" fill="#C84B31" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ===== INCOME CHART ===== */}
            {incomeData.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-xl text-green-700 mb-4">
                    Income Distribution
                  </h2>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        Total Income: ₹{totalIncome.toLocaleString()}
                      </h3>
                      <ul className="text-gray-600 text-sm space-y-1">
                        {incomeData.map((d, i) => (
                          <li key={d.name} className="flex items-center gap-2">
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: COLORS[i % COLORS.length],
                              }}
                            ></span>
                            {d.name}: ₹{d.value.toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right chart */}
                    <div className="flex-1 h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === "pie" ? (
                          <PieChart>
                            <Pie
                              data={incomeData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={120}
                              dataKey="value"
                            >
                              {incomeData.map((entry, index) => (
                                <Cell
                                  key={`inc-cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                            <Legend />
                          </PieChart>
                        ) : (
                          <BarChart data={incomeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(v) => `₹${v.toLocaleString()}`}
                              labelFormatter={(name) => `Category: ${name}`}
                            />
                            <Legend />
                            <ReferenceLine y={0} stroke="#999" />
                            <Bar dataKey="value" fill="#5DBB63" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
