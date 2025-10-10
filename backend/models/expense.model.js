import mongoose from "mongoose";

const expenseSchema = mongoose.Schema({
    description:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true, 
    },
    category:{
        type: String,
        required: true,
    },
    done:{
        type: Boolean,
        default: false,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},{timestamps:true});
const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;