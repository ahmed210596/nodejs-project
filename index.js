const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const db = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/mydb');
        console.log("Connected to Database");
    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }
};

db();

const insertCustomers = (db, data, callback) => {
    // Get the customers collection
    const collection = db.collection('customers');
    
    // Insert a customer
    collection.insertOne(data, (err, result) => {
        if (err) {
            throw err;
            console.log(err);
        }

        console.log("Inserted customer into the collection");
        callback(result);
    });
};

app.post("/sign_up", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;

    var data = {
        "name": name,
        "email": email,
        "phno": phno,
        "password": password
    };

    insertCustomers(mongoose.connection, data, (result) => {
        console.log("Record Inserted Successfully");
        return res.redirect('signup_success.html');
    });
});

app.get("/", (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": "*"
    });
    return res.redirect('index.html');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log("Listening on PORT 3000");
});