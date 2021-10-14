const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// http://localhost:5000

//middleware
app.use(cors()); 
app.use(express.json()); // gives us access to request JSON data


//ROUTES//


//create a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;

        //adds to database
        const new_todo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );
        res.json(new_todo.rows[0]);
    }
    catch (err) {
        console.error(err.message);
    }
});

//get all todos
app.get("/todos", async(req, res) => {
    try {
        const all_todos = await pool.query("SELECT * FROM todo");
        res.json(all_todos.rows);
    }
    catch (err) {
        console.error(err.message);
    }
});

//get a todo
app.get("/todos/:id", async(req, res) => {
    try {
        //console.log(req.params);
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
            id
        ]);
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a todo
app.put("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const update_todo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [
            description,
            id
        ]);
        res.json("todo list updated");
    } catch (err) {
        console.error(err.message);
    }
});

//delete a todo
app.delete("/todos/:id", async(req, res) => {
    try {
        //console.log(req.params);
        const {id} = req.params;
        const delete_todo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
            id
        ]);
        res.json("todo was deleted");
    } catch (err) {
        console.error(err.message);
    }
});


//Confirm the server has been started on correct port
app.listen(5000, () => {
    console.log("server has started on port 5000");
});