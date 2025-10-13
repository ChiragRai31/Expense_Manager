import NavBar from "./NavBar";
import CreateExpense from "./CreateExpense";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "./ui/select";
import ExpenseTable from "./ExpenseTable";
import useGetExpenses from "../hooks/useGetExpenses";
import { useDispatch } from "react-redux";
import { setCategory, setMarkAsDone } from "../redux/expenseSlice";

const Home = () => {
  useGetExpenses();
  const dispatch = useDispatch();
  const handleCategoryChange = (value) => {
    dispatch(setCategory(value));
  };
  const handleDoneChange = (value) => {
    dispatch(setMarkAsDone(value));
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto mt-6 ">
        <div className="flex items-center justify-between mb-5">
          <h1>Expense</h1>
          <CreateExpense />
        </div>
        <div className="flex items-center gap-2 my-5">
          <h1 className="font-medium text-lg">Filter By:</h1>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="bills">Bills</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={handleDoneChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mark As " />
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
        <ExpenseTable />
      </div>
    </div>
  );
};

export default Home;
