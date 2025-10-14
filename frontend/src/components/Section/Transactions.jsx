import React from "react";
import NavBar from "../NavBar";
import Sidebar from "../SideBar";
import ExpenseTable from "../ExpenseTable";
import CreateExpense from "../CreateExpense";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "../ui/select";
import { useDispatch } from "react-redux";
import { setCategory, setMarkAsDone } from "../../redux/expenseSlice"
import useGetExpenses from "../../hooks/useGetExpenses";

const Transactions = () => {
  useGetExpenses();
  const dispatch = useDispatch();

  const handleCategoryChange = (value) => dispatch(setCategory(value));
  const handleDoneChange = (value) => dispatch(setMarkAsDone(value));

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf5]">
      {/* ✅ Top Navigation Bar */}
      <NavBar />

      <div className="flex flex-1">
        {/* ✅ Left Sidebar */}
        <Sidebar />

        {/* ✅ Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with Create Expense */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">
                Transaction Details
              </h1>
              <CreateExpense />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
              <h1 className="font-medium text-lg text-gray-700">
                Filter By:
              </h1>

              {/* Category Filter */}
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
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
                    <SelectItem value="all">All</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Mark As Filter */}
              <Select onValueChange={handleDoneChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Mark As" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="undone">Undone</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Expense Table */}
            <ExpenseTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
