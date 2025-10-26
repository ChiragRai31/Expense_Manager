import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import { setExpense } from "../redux/expenseSlice";
const useGetExpenses = () => {
    const dispatch = useDispatch();

    const {category, markAsDone} = useSelector((state) => state.expense);
    
    useEffect(() => {
    const fetchExpenses = async () => {
      try{
        const response = await api.get(`/api/v1/expense/getall?category=${category}&done=${markAsDone}`);
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