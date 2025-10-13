import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
    name: "expense",
    initialState: {
        category:"",
        markAsDone:"",
        expenses: [],
        singleExpense:null,
        // loading: false,
        // error: null,
    },
    reducers: {
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        setExpense: (state, action) => {
            state.expenses=action.payload;
        },
        setSingleExpense: (state, action) => {
            state.singleExpense = action.payload;
        },
        //setLoading: (state, action) => {
        //     state.loading = action.payload;
        // },
        // setError: (state, action) => {
        //     state.error = action.payload;
        // },
        setMarkAsDone: (state, action) => {
            state.markAsDone = action.payload;
        }
    },
});
export const { setCategory, setMarkAsDone, setExpense, setSingleExpense} = expenseSlice.actions;
export default expenseSlice.reducer;