const express = require("express");
const path = require('path');
const ejs = require('ejs')
const https = require("https");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const { INSPECT_MAX_BYTES } = require("buffer");
const app = express();

app.use(express.static("public"));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todolist"
})
connection.connect((err) => {
    if (err) throw err;
    console.log("connected successfully ... ");
})

app.get("/", (req, res) => {
    let option = { weekly: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today = new Date();
    let day = today.toLocaleDateString("en-us", option);
    let sql = "SELECT * FROM items";
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('list', {
            title: 'TO-DOLIST',
            day: day,
            items: result
        });
    });
})

app.get("/add", (req, res) => {
    res.render('addTask', {

        title: 'ADD TASK',


    })
})

app.post('/save', (req, res) => {
    let data = { task: req.body.name };
    let sql = "INSERT INTO items SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});


app.get('/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from items where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('update', {
            title: 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            items: result[0]
        });
    });
});

app.post('/update', (req, res) => {
    const userId = req.body.id;
    let sql = "update items SET task='" + req.body.name + "' where id =" + userId;
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});


app.get('/delete/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from items where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(3030, () => {
    console.log("Server is running");
});
