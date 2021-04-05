const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.get("/", function(req, res){
    var today = new Date()
    var thisDay = today.toString().split(' ')[0]

    if(today.getDay() === 6 || today.getDay() === 0){
        res.send("<h1>Everybody's working for the weekend</h1>")
    }else{
        res.send("<h1>Today is " + thisDay + "day You have to go to work today</h1>")
    }
})

app.listen(3000, function(){
    console.log("Server running on port 3000")
})