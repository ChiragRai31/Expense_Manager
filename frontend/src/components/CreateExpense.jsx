import React from "react";
import axios from "axios";
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setExpense } from "../redux/expenseSlice";

const CreateExpense = () => {
  const [formData, setFormData] = React.useState({
    description: "",
    amount: "",
    category: "",
    customCategory: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useDispatch();
  const {expenses}=useSelector(store => store.expense);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory =
      formData.category === "others"
        ? formData.customCategory
        : formData.category;

    const payload = {
      description: formData.description,
      amount: formData.amount,
      category: finalCategory,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/expense/add",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setExpense([...expenses, res.data.expense]));
        toast.success(res.data.message);
        setIsOpen(false);
        
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="outline">
          Add New Expense
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Create a new expense and assign it to a category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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

            <div className="grid gap-3 grid-cols-4 items-center">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                placeholder="xxxx in ₹"
                className="col-span-3"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-3 grid-cols-4 items-center">
              <Label htmlFor="category">Category</Label>
              <div className="col-span-3">
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="bills">Bills</SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="groceries">Groceries</SelectItem>
                      <SelectItem value="miscellaneous">
                        Miscellaneous
                      </SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* Show custom category input only when 'Others' is selected */}
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
                <Button type="submit">Add</Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExpense;
