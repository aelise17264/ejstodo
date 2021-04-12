const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true})

const itemSchema = {
    name: String
}

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
    name: "Welcome to your todolist!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item"
})

const item3 = new Item({
    name: "Hit the checkbox to delete your finished item"
})

const defaultItems = [item1, item2, item3]



app.get("/", function(req, res){



    Item.find({}, function(err, foundItems){
    //   console.log(foundItems)
    
    if(foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){
            if(err){
                console.log(err)
            }else{
                console.log("Success")
            }
        })
        res.redirect("/")
    }else{
        res.render("list", {listTitle: "Today", newToDo: foundItems})

    }


      
    })

    // var today = new Date()
    // var thisDay = today.toString().split(' ')[0] + "day"
    // var options = {
    //     weekday: "long",
    //     day: "numeric",
    //     month: "long"
    // }
    // let thisDay = today.toLocaleDateString("en-US", options)
    // if(today.getDay() === 6 || today.getDay() === 0){
    //     res.send("<h1>Everybody's working for the weekend</h1>")
    // }else{
    //}
})

// app.post("/", function(req, res){
//     var item = req.body.newItem
//     items.push(item)

//     res.redirect("/")
// })

app.post("/", function(req, res){
    // let item = req.body.newItem

    // if(req.body.list === "Work"){
    //     workItems.push(item)
    //     res.redirect("/work")
    // }else{
    //     items.push(item)
    //     res.redirect("/")
    // }
    const itemName = req.body.newItem

    const item = new Item({
        name: itemName
    })

    item.save()

    res.redirect("/")
})

app.post("/delete", function(req, res){
    // console.log(req.body)
    const checkedID = req.body.checkbox
    Item.findByIdAndRemove(checkedID, function(err){
        if(err){
            console.log(err)
        }else{
            console.log("it's gone")
            res.redirect("/")
        }
    })
    
})

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work", newToDo: workItems})
})

app.get("/about", function(req, res){
    res.render("about")
})

app.listen(3000, function(){
    console.log("Server running on port 3000")
})