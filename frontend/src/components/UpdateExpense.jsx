import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setExpense, setSingleExpense } from "../redux/expenseSlice";

const predefinedCategories = [
  "bills",
  "entertainment",
  "food",
  "groceries",
  "miscellaneous",
  "rent",
  "shopping",
  "subscription",
  "salary",
  "others",
];

const UpdateExpense = ({ expense }) => {
  const { expenses } = useSelector((store) => store.expense);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    customCategory: "",
    type: "expense", // 👈 new: default type
  });

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 🧩 Initialize form data properly (handle custom category & type)
  useEffect(() => {
    if (expense) {
      const type = expense.amount < 0 ? "income" : "expense";
      if (predefinedCategories.includes(expense.category)) {
        setFormData({
          description: expense.description || "",
          amount: Math.abs(expense.amount) || "",
          category: expense.category,
          customCategory: "",
          type,
        });
      } else {
        setFormData({
          description: expense.description || "",
          amount: Math.abs(expense.amount) || "",
          category: "others",
          customCategory: expense.category || "",
          type,
        });
      }
    }
  }, [expense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  const handleTypeChange = (e) => {
    setFormData({ ...formData, type: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      formData.category === "others"
        ? formData.customCategory
        : formData.category;

    // 👇 Apply negative sign if type is income
    const finalAmount =
      formData.type === "income"
        ? -Math.abs(Number(formData.amount))
        : Math.abs(Number(formData.amount));

    const payload = {
      description: formData.description,
      amount: finalAmount,
      category: finalCategory,
    };

    try {
      setLoading(true);
      const res = await api.put(
        `/api/v1/expense/update/${expense._id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedExpenses = expenses.map((exp) =>
          exp._id === expense._id ? res.data.expense : exp
        );
        dispatch(setExpense(updatedExpenses));
        toast.success(res.data.message);
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating the record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            dispatch(setSingleExpense(expense));
            setIsOpen(true);
          }}
          variant="outline"
          size="icon"
          className="rounded-full border-green-600 text-green-600 hover:border-transparent"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Transaction</DialogTitle>
          <DialogDescription>
            Modify details below and click “Update”.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Description */}
            <div className="grid gap-3 grid-cols-4 items-center">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Description"
                className="col-span-3"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Amount */}
            <div className="grid gap-3 grid-cols-4 items-center">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                placeholder="xxxx in ₹"
                className="col-span-3"
                type="number"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            {/* Type (Income or Expense) */}
            <div className="grid gap-3 grid-cols-4 items-center">
              <Label htmlFor="type">Type</Label>
              <div className="col-span-3 flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === "expense"}
                    onChange={handleTypeChange}
                  />
                  <span>Expense</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === "income"}
                    onChange={handleTypeChange}
                  />
                  <span>Income</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="grid gap-3 grid-cols-4 items-center">
              <Label htmlFor="category">Category</Label>
              <div className="col-span-3">
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {predefinedCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {formData.category === "others" && (
                  <Input
                    name="customCategory"
                    placeholder="Enter custom category"
                    className="mt-3"
                    value={formData.customCategory}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Update</Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateExpense;
