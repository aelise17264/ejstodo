const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const _ = require("lodash")

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://ab-admin:Password123@cluster0.bj2rh.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

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

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema)

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

})


app.post("/", function(req, res){

    const itemName = req.body.newItem

    const listName = req.body.list

    const item = new Item({
        name: itemName
    })

    if(listName === "Today"){
        item.save()

        res.redirect("/")
    }else{
        List.findOne({name: listName}, function(err, foundName){
            foundName.items.push(item)
            foundName.save()
            res.redirect("/" + listName)
        })
    }
})

app.post("/delete", function(req, res){
    // console.log(req.body)
    const checkedID = req.body.checkbox

    const listName = req.body.listName

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedID, function(err){
            if(err){
                console.log('its not working')
            }else{
                console.log("it's gone")
                res.redirect("/")
            }
        })
    }else{
        List.findOneAndUpdate({name: listName},
         {$pull: {items: {_id: checkedID}}},
         function(err, foundName){
            if(!err){
                res.redirect("/" + listName)
            }
        }
        )
    }   
})

app.get("/:customName", function(req, res){
    const customName = _.capitalize(req.params.customName)
    
    List.findOne({name: customName}, function(err, foundName){
        if(!err){
            if(!foundName){
                //Create a new list
                const list = new List({
                    name: customName,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + customName)

            }else{
                //show an existing list
                res.render("list", {listTitle: foundName.name, newToDo: foundName.items})
            }
        }
    })

    })


app.listen(3000, function(){
    console.log("Server running on port 3000")
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

    // app.get("/about", function(req, res){
//     res.render("about")
// })

    // let item = req.body.newItem

    // if(req.body.list === "Work"){
    //     workItems.push(item)
    //     res.redirect("/work")
    // }else{
    //     items.push(item)
    //     res.redirect("/")
    // }

    // app.post("/", function(req, res){
//     var item = req.body.newItem
//     items.push(item)

//     res.redirect("/")
// })

//console.log(customName)
    //res.render("list", {listTitle: "Work", newToDo: workItems})
