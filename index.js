const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));



// connecting to database and creating schema.
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/todoList", {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("successfully connected to the database");
}).catch((error) => {
    console.log(error);
});

const itemSchema = new mongoose.Schema({
    name: String
});


const listSchema = new mongoose.Schema({
    name:String,
    items : [itemSchema]
});


//model for listSchema
const ListModel = new mongoose.model("ListModel" , listSchema);
const ItemCollection = new mongoose.model("ItemCollection", itemSchema);
var tasks;
// get for home
app.get("/", (req, res) => {

    ItemCollection.find({}, (error, data) => {
        if (error) {
            console.log(error);
            res.render("list", {
                day: "Today",
                newTask: []
            });
        }
        else {
            res.render("list", {
                day: "Today",
                newTask: data
            })
        }
    });
});



// delete from list.
app.post("/delete", (req, res)=>{
    var checked_id = req.body.checkbox;
    console.log(checked_id);
    ItemCollection.findByIdAndRemove(checked_id , (error)=>{
        if(error){
            console.log(error);
        }
    });
    res.redirect("/");
    
});

// dynamic url
app.get("/:urlParameter" , (req , res)=>{
    const listType = req.params.urlParameter;
    
    ListModel.findOne({name : listType} , (error ,result)=>{
        if(!error){
            if(!result){
                const listDoc = new ListModel({
                    name : listType,
                    items : []
                });
                listDoc.save();
                res.redirect("/" + listType);
            }
            else{
                // show existing list.
                res.render("list" , {
                    day : result.name,
                    newTask : result.items
                } );
            }
        }
        else{
            console.log(error);
            res.redirect("/");
        }
    });
    
});


// get for about
app.get("/about", (req, res) => {
    res.render("about", {});
});


//post for all
app.post("/", (req, res) => {
    const task = req.body.newItem;
    const listName = req.body.list;

    const documentItem = new ItemCollection({
        name: task
    });

    if(listName === "today"){
       documentItem.save();
       res.redirect("/"); 
    }else{
        ListModel.findOne({ name : listName } , (error , result)=>{
            if(!error){
                result.items.push(documentItem);
                result.save();
                res.redirect("/" + listName);
            }else{
                console.log(error);
                res.redirect("/");
            }
        });
    }


})



// server is listening...
app.listen(3000, () => {

    console.log("You are favorite child of the Universe, Shreyas :)");

})