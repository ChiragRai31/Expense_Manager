import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {Card, CardContent} from '../ui/card'
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Calendar, Wallet, PiggyBank, TrendingDown } from "lucide-react";
import dayjs from "dayjs";

const Overview = () => {
  const expenses = useSelector((state) => state.expense.expenses);

  const summaries = useMemo(() => {
    const today = dayjs();
    const startOfWeek = today.startOf("week");
    const startOfMonth = today.startOf("month");
    const startOfYear = today.startOf("year");

    let totalIncome = 0;
    let totalExpense = 0;

    let todayExpense = 0;
    let weekExpense = 0;
    let monthExpense = 0;
    let yearExpense = 0;

    let todayIncome = 0;
    let weekIncome = 0;
    let monthIncome = 0;
    let yearIncome = 0;

    // Initialize all months (Jan–Dec)
    const allMonths = Array.from({ length: 12 }, (_, i) =>
      dayjs().month(i).format("MMM")
    );

    const monthlyTrends = {};
    allMonths.forEach((month) => {
      monthlyTrends[month] = { income: 0, expense: 0 };
    });

    // Aggregate all data
    expenses.forEach((item) => {
      const date = dayjs(item.date);
      const amount = Number(item.amount);
      const isExpense = amount > 0;
      const isIncome = amount < 0;
      const absAmount = Math.abs(amount);

      // Total aggregates
      if (isIncome) totalIncome += absAmount;
      if (isExpense) totalExpense += absAmount;

      // Period filters
      if (date.isSame(today, "day")) {
        if (isExpense) todayExpense += absAmount;
        if (isIncome) todayIncome += absAmount;
      }
      if (date.isAfter(startOfWeek)) {
        if (isExpense) weekExpense += absAmount;
        if (isIncome) weekIncome += absAmount;
      }
      if (date.isAfter(startOfMonth)) {
        if (isExpense) monthExpense += absAmount;
        if (isIncome) monthIncome += absAmount;
      }
      if (date.isAfter(startOfYear)) {
        if (isExpense) yearExpense += absAmount;
        if (isIncome) yearIncome += absAmount;
      }

      // Add to monthly trends (for the current year only)
      if (date.isAfter(startOfYear)) {
        const monthName = date.format("MMM");
        if (isIncome) monthlyTrends[monthName].income += absAmount;
        if (isExpense) monthlyTrends[monthName].expense += absAmount;
      }
    });

    // Prepare chart data (always 12 months)
    const trendData = allMonths.map((month) => ({
      name: month,
      income: monthlyTrends[month].income,
      expense: -monthlyTrends[month].expense, // negative for downward bars
    }));

    return {
      totalIncome,
      totalExpense,
      todayExpense,
      weekExpense,
      monthExpense,
      yearExpense,
      todayIncome,
      weekIncome,
      monthIncome,
      yearIncome,
      trendData,
    };
  }, [expenses]);

  return (
    <div className="space-y-8">
      {/* Header Summary */}
      <div className="flex flex-wrap gap-6">
        <Card className="flex-1 min-w-[280px]">
          <CardContent className="p-5">
            <h2 className="font-semibold text-lg mb-2">
              {dayjs().format("MMMM")} Summary
            </h2>
            <p className="text-red-600 text-2xl font-bold">
              Expense: ₹{summaries.monthExpense.toLocaleString()}
            </p>
            <p className="text-green-600 text-xl">
              Income: ₹{summaries.monthIncome.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[280px]">
          <CardContent className="p-5">
            <h2 className="font-semibold text-lg mb-2">Total Overview</h2>
            <div className="grid grid-cols-3 text-center">
              <div>
                <Wallet className="mx-auto mb-1 text-gray-500" />
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="font-semibold text-green-600">
                  ₹{summaries.totalIncome.toLocaleString()}
                </p>
              </div>
              <div>
                <TrendingDown className="mx-auto mb-1 text-gray-500" />
                <p className="text-sm text-gray-500">Total Expense</p>
                <p className="font-semibold text-red-600">
                  ₹{summaries.totalExpense.toLocaleString()}
                </p>
              </div>
              <div>
                <PiggyBank className="mx-auto mb-1 text-gray-500" />
                <p className="text-sm text-gray-500">Net Savings</p>
                <p
                  className={`font-semibold ${
                    summaries.totalIncome - summaries.totalExpense > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{(
                    summaries.totalIncome - summaries.totalExpense
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time-based summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Today", exp: summaries.todayExpense, inc: summaries.todayIncome },
          { label: "This Week", exp: summaries.weekExpense, inc: summaries.weekIncome },
          { label: "This Month", exp: summaries.monthExpense, inc: summaries.monthIncome },
          { label: "This Year", exp: summaries.yearExpense, inc: summaries.yearIncome },
        ].map((period) => (
          <Card key={period.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="text-gray-500" />
                <p className="text-gray-600 text-sm">{period.label}</p>
              </div>
              <p className="text-red-600 font-semibold">
                Expense: ₹{period.exp.toLocaleString()}
              </p>
              <p className="text-green-600 font-semibold">
                Income: ₹{period.inc.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Income vs Expense Trend Chart */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Income and Expense Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ReBarChart
              data={summaries.trendData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) =>
                  `${name}: ₹${Math.abs(value).toLocaleString()}`
                }
              />
              <Legend />
              <ReferenceLine y={0} stroke="#999" />
              {/* Income (upward) */}
              <Bar dataKey="income" fill="#D05F33" radius={[4, 4, 0, 0]} />
              {/* Expense (downward) */}
              <Bar dataKey="expense" fill="#44AC9E" radius={[0, 0, 4, 4]} />
            </ReBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;