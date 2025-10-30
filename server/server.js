const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Todo = require('./Models/todoModels');

const connectDB = require('./config/db');

connectDB();

const app = express();
const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());



app.post("/api/createTodo", async(req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }
    const newTodo = new Todo({
      title: title.trim(),
    });
    await newTodo.save();

    return res.status(201).json({
      message: "Todo created successfully",
      todo: newTodo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({ todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.delete("/api/deleteTodo/:id", async(req, res) => {
  try{
    const todoId = req.params.id;
    const deletedTodo = await Todo.findByIdAndDelete(todoId);
    if(!deletedTodo){
      return res.status(404).json({ error: "Todo not found"});
    }
    return res.json({ message: "Todo deleted successfully"});
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error"})
  }
  

})

app.put("/api/updateTodo/:id", async (req, res) => {
  const { title, completed } = req.body;
  const updateTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { title, completed },
    { new: true }
  );
  if (!updateTodo) return res.status(404).json({ error: "Todo not found" });
  return res.json({ message: "Todo updated successfully", todo: updateTodo });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
