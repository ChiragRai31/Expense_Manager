import express from 'express';
import { addExpense, getAllExpenses, removeExpense,updateExpense,markAsDoneOrUndone } from '../controllers/expense.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// Add a new expense
router.post('/add', isAuthenticated, addExpense);
// Get all expenses
router.get('/getall', isAuthenticated, getAllExpenses);
// Delete an expense
router.delete('/delete/:id', isAuthenticated, removeExpense);
// Update an expense
router.put('/update/:id', isAuthenticated, updateExpense);
// Mark an expense as done
router.put('/:id/done', isAuthenticated, markAsDoneOrUndone);

export default router;