const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.set('view engine', 'ejs');

app.get("/", function(req, res){
    var today = new Date()
    var thisDay = today.toString().split(' ')[0] + "day"

    if(today.getDay() === 6 || today.getDay() === 0){
        res.send("<h1>Everybody's working for the weekend</h1>")
    }else{
        res.render("list", {day: thisDay})
    }
})

app.listen(3000, function(){
    console.log("Server running on port 3000")
})