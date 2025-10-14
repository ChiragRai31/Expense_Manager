import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { PlusCircle, RefreshCcw, Import, Search, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import UpdateExpense from "./UpdateExpense";
import dayjs from "dayjs";

const ExpenseTable = () => {
  const { expenses } = useSelector((store) => store.expense);
  const [localExpenses, setLocalExpenses] = useState(expenses);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

  // === Search filter ===
  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return localExpenses.filter(
      (e) =>
        e.description?.toLowerCase().includes(lower) ||
        e.category?.toLowerCase().includes(lower)
    );
  }, [localExpenses, search]);

  // === Group by date ===
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((exp) => {
      const dateKey = dayjs(exp.date || exp.createdAt).format("MMMM DD, YYYY");
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(exp);
    });
    return Object.entries(map).sort(
      (a, b) => dayjs(b[0]).valueOf() - dayjs(a[0]).valueOf()
    );
  }, [filtered]);

  // === Totals ===
  const totalPending = localExpenses
    .filter((e) => !e.done)
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalIncome = localExpenses
    .filter((e) => e.amount < 0)
    .reduce((s, e) => s + Math.abs(e.amount), 0);
  const totalExpense = localExpenses
    .filter((e) => e.amount > 0)
    .reduce((s, e) => s + e.amount, 0);

  // === Refresh ===
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/v1/expense/getall", {
        withCredentials: true,
      });
      if (res.data.success) {
        setLocalExpenses(res.data.expense);
        toast.success("Transactions refreshed");
      }
    } catch {
      toast.error("Failed to refresh transactions");
    } finally {
      setLoading(false);
    }
  };

  // === Toggle done ===
  const handleCheckboxChange = async (id) => {
    const exp = localExpenses.find((e) => e._id === id);
    const newStatus = !exp.done;
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/expense/${id}/done`,
        { done: newStatus },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setLocalExpenses((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, done: newStatus } : item
          )
        );
        toast.success(res.data.message);
      }
    } catch {
      toast.error("Failed to update expense status");
    }
  };

  // === Delete ===
  const removeExpenseHandler = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/expense/delete/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setLocalExpenses((prev) => prev.filter((e) => e._id !== id));
      }
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Transaction List</h2>

        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-1"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {/* ===== Totals & Search ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          <p>
            <span className="font-semibold text-green-600">
              Total Income: ₹{totalIncome.toLocaleString()}
            </span>{" "}
            |{" "}
            <span className="font-semibold text-red-600">
              Total Expense: ₹{totalExpense.toLocaleString()}
            </span>{" "}
            |{" "}
            <span className="font-semibold text-gray-800">
              Pending Total: ₹{totalPending.toLocaleString()}
            </span>
          </p>
        </div>

        <div className="flex items-center relative w-[250px]">
          <Search
            size={16}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <Input
            placeholder="Search transaction"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* ===== Transaction Groups ===== */}
      <div className="border rounded-lg bg-white shadow-sm">
        {grouped.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No transactions found
          </div>
        ) : (
          grouped.map(([date, list]) => (
            <div key={date} className="p-4 border-b last:border-none">
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="font-semibold text-gray-700">{date}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {dayjs(date).format("dddd")}
                </span>
              </div>

              {/* Column Header */}
              <div className="hidden sm:grid grid-cols-6 text-xs font-medium text-gray-500 border-b pb-1 mb-2">
                <span>Done</span>
                <span>Time</span>
                <span>Description</span>
                <span>Amount</span>
                <span>Category</span>
                <span className="text-center">Actions</span>
              </div>

              {/* Transactions */}
              <div className="space-y-2">
                {list.map((tx) => (
                  <div
                    key={tx._id}
                    className={`grid grid-cols-6 items-center text-sm py-2 border-b last:border-none ${
                      tx.done ? "opacity-60 line-through" : ""
                    }`}
                  >
                    {/* Done */}
                    <div className="flex justify-start">
                      <Checkbox
                        checked={tx.done}
                        onCheckedChange={() => handleCheckboxChange(tx._id)}
                      />
                    </div>

                    {/* Time */}
                    <div className="text-gray-500">
                      {dayjs(tx.date || tx.createdAt).format("hh:mm A")}
                    </div>

                    {/* Description */}
                    <div className="text-gray-800 truncate">
                      {tx.description || "No description"}
                    </div>

                    {/* Amount */}
                    <div
                      className={`font-semibold ${
                        tx.amount < 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{Math.abs(tx.amount).toLocaleString()}
                    </div>

                    {/* Category */}
                    <div className="font-medium text-gray-700">
                      {tx.category || "Uncategorized"}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-2">
                      <UpdateExpense expense={tx} />
                      <Button
                        onClick={() => removeExpenseHandler(tx._id)}
                        size="icon"
                        className="rounded-full border text-red-600 border-red-600 hover:border-transparent"
                        variant="outline"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseTable;
