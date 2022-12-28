const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static('public'));


const tasks = [];
const workTasks = [];

// get for home
app.get("/", (req, res) => {
    day = date();
    res.render("list" , {day: day,
        newTask : tasks    
    });
});


// get for work
app.get("/workday" , (req , res)=>{
    res.render("list" , {day : "HustleDay" , 
        newTask : workTasks});
});


// get for about
app.get("/about" , (req , res)=>{
    res.render("about" , {});
});


//post for all
app.post("/" , (req , res)=>{
    const task = req.body.newItem;
    const type = req.body.list;

    if(type == "HustleDay"){
        workTasks.push(task);
        res.redirect("/workday");
    }else{
        tasks.push(task);
        res.redirect("/");
    }

})



// server is listening...
app.listen(3000, () => {

    console.log("You are favorite child of the Universe, Shreyas :)");

})