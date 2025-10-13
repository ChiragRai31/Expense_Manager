import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setExpense } from "../redux/expenseSlice";
const useGetExpenses = () => {
    const dispatch = useDispatch();

    const {category, markAsDone} = useSelector((state) => state.expense);
    
    useEffect(() => {
    const fetchExpenses = async () => {
      try{
        axios.defaults.withCredentials = true;
        const response = await axios.get(`http://localhost:8000/api/v1/expense/getall?category=${category}&done=${markAsDone}`);
        if(response.data.success){
            dispatch(setExpense(response.data.expense));
            }
        
        }
         catch (error) {
            console.error(error);
        }
        
        }
        fetchExpenses();
    },[dispatch, category, markAsDone])
}
export default useGetExpenses;