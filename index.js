const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")

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
    const checked_id = req.body.checkbox;
    let listName = req.body.listName;
    //console.log(listName);
    if(listName == "Today"){
        ItemCollection.findByIdAndRemove(checked_id , (error)=>{
            if(error){
                console.log(error);
            }
        });
        res.redirect("/");
    }else{
        ListModel.findOneAndUpdate({name : listName} , {$pull : {items:{_id : checked_id}}} , (error,result)=>{
            if(error){
                console.log(error);
            }
            else{
                res.redirect("/" + listName);
            }
        });
    }
    
    
});

// dynamic url
app.get("/:urlParameter" , (req , res)=>{
    var listType = req.params.urlParameter;
    listType = _.capitalize(listType);
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
    console.log(listName  + " " + task);
    const documentItem  = new ItemCollection({
        name : task
    });
    if(listName == "Today"){
        documentItem.save();
        res.redirect("/");
    }else{
        ListModel.findOne({ name : listName } ,(error , result)=>{
            if(!error){
                result.items.push(documentItem);
                result.save();
                res.redirect("/" + listName);
                
            }else{
                res.redirect("/" + listName);
            }
        } );
    }

/*

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

*/
})



// server is listening...
app.listen(3300, () => {

    console.log("You are favorite child of the Universe, Shreyas :)");

})