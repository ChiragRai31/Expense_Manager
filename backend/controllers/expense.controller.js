import Expense from '../models/expense.model.js';
export const addExpense = async (req, res) => {
    try {
        const { description, amount, category } = req.body;
        const userId = req.userId || req.id;
        if (!description || !amount || !category) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        };
        const expense = await Expense.create({
            description,
            amount,
            category,
            userId
        });
        return res.status(201).json({   
            message: "Expense added successfully",
            expense,
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}   
export const getAllExpenses =async(req,res)=>{
    try {
        const userId=req.userId || req.id;
        let category = req.query.category || "";
        const done = req.query.done || "";
        const query = { userId };
        if (category.toLowerCase() === "all") {
        
        }else{
            query.category = { $regex: category, $options: "i" };
        }
        if(done.toLowerCase()==="done"){
            query.done = true;
        }
        else if(done.toLowerCase()==="undone"){
            query.done = false;
        };
        const expenses=await Expense.find(query);
        if(!expenses || expenses.length===0){
            return res.status(404).json({
                message:"No expenses found",
                success:false
            })
        };
        return res.status(200).json({
            message:"Expenses fetched successfully",
            expenses,
            success:true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}
export const markAsDoneOrUndone=async(req,res)=>{
    try {
        const userId = req.userId || req.id;
        const expenseId = req.params.id;
        // expect body like { done: true }
        const update = {};
        if (Object.prototype.hasOwnProperty.call(req.body, 'done')) {
            update.done = req.body.done;
        } else {
            // if no explicit value provided, toggle
            const existing = await Expense.findOne({ _id: expenseId, userId });
            if (!existing) {
                return res.status(404).json({ message: 'Expense not found', success: false });
            }
            update.done = !existing.done;
        }
        const expense = await Expense.findOneAndUpdate({ _id: expenseId, userId }, update, { new: true });

        if(!expense){
            return res.status(404).json({
                message:"Expense not found",
                success:false
            })
        };
        return res.status(200).json({
            message:`Expense marked as ${expense.done?"done":"undone"} successfully`,
            success:true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}
export const removeExpense=async(req,res)=>{
    try {
        const userId = req.userId || req.id;
        const expenseId = req.params.id;
        const deleted = await Expense.findOneAndDelete({ _id: expenseId, userId });
        if (!deleted) {
            return res.status(404).json({ message: 'Expense not found', success: false });
        }
        return res.status(200).json({ message: 'Expense deleted successfully', success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}
export const updateExpense=async(req,res)=>{
    try {
        const { description, amount, category } = req.body;
        const userId = req.userId || req.id;
        const expenseId = req.params.id;
        const updateData = {};
        if (description !== undefined) updateData.description = description;
        if (amount !== undefined) updateData.amount = amount;
        if (category !== undefined) updateData.category = category;

        const expense = await Expense.findOneAndUpdate({ _id: expenseId, userId }, updateData, { new: true });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or not owned by user', success: false });
        }
        return res.status(200).json({ message: 'Expense updated successfully', expense, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}