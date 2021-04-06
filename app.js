const express = require("express")
const bodyParser = require("body-parser")

const app = express()

var items = []

let workItems = []

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set('view engine', 'ejs');

app.get("/", function(req, res){
    var today = new Date()
    // var thisDay = today.toString().split(' ')[0] + "day"
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let thisDay = today.toLocaleDateString("en-US", options)
    // if(today.getDay() === 6 || today.getDay() === 0){
    //     res.send("<h1>Everybody's working for the weekend</h1>")
    // }else{
        res.render("list", {listTitle: thisDay, newToDo: items})
    //}
})

// app.post("/", function(req, res){
//     var item = req.body.newItem
//     items.push(item)

//     res.redirect("/")
// })

app.post("/", function(req, res){
    let item = req.body.newItem

    if(req.body.list === "Work"){
        workItems.push(item)
        res.redirect("/work")
    }else{
        items.push(item)
        res.redirect("/")
    }

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