import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import UpdateExpense from "./UpdateExpense";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const ExpenseTable = () => {
  const { expenses } = useSelector((store) => store.expense);
  const [localExpenses, setLocalExpenses] = useState(expenses);

  // keep localExpenses in sync with redux
  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

  // ✅ compute total only for undone expenses
  const totalAmount = localExpenses.reduce((acc, expense) => {
    return expense.done ? acc : acc + expense.amount;
  }, 0);

  // ✅ toggle done/undone
  const handleCheckboxChange = async (id) => {
    const expense = localExpenses.find((e) => e._id === id);
    const newStatus = !expense.done;

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
        toast.success(res.data.message);
        setLocalExpenses((prev) =>
          prev.map((exp) =>
            exp._id === id ? { ...exp, done: newStatus } : exp
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update expense status");
    }
  };

  // ✅ delete expense
  const removeExpenseHandler = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/expense/delete/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setLocalExpenses((prev) =>
          prev.filter((expense) => expense._id !== id)
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    }
  };

  return (
    <Table>
      <TableCaption>A list of your recent expenses.</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Mark As Done</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {localExpenses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500 py-4">
              Add Your First Expense
            </TableCell>
          </TableRow>
        ) : (
          localExpenses.map((expense) => (
            <TableRow key={expense._id}>
              <TableCell className="font-medium">
                <Checkbox
                  checked={expense.done}
                  onCheckedChange={() => handleCheckboxChange(expense._id)}
                />
              </TableCell>

              <TableCell className={expense.done ? "line-through" : ""}>
                {expense.description}
              </TableCell>

              <TableCell className={expense.done ? "line-through" : ""}>
                ₹{expense.amount}
              </TableCell>

              <TableCell className={expense.done ? "line-through" : ""}>
                {expense.category}
              </TableCell>

              <TableCell className={expense.done ? "line-through" : ""}>
                {expense.createdAt?.split("T")[0]}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <UpdateExpense expense={expense} />
                  <Button
                    onClick={() => removeExpenseHandler(expense._id)}
                    size="icon"
                    className="rounded-full border text-red-600 border-red-600 hover:border-transparent"
                    variant="outline"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="font-bold text-lg">
            Total
          </TableCell>
          <TableCell className="text-right font-bold text-lg">
            ₹{totalAmount}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ExpenseTable;
