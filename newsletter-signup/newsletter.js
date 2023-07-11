const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https"); //in built express module
const app = express();

app.use(express.static("public")); // jo files desktop pr hai usko local karta ha. Folder bana le
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
}) // sends the file from the server when client asks for it. Main page

app.post("/",function(req,res){  // apna data post krre server ko store karke rakhega
   const firstName = (req.body.fName); // html name = req.body.html name
   const lastName = (req.body.lName);
   const email = (req.body.email);

   const data = {   // add new subscriber to maililing list data === object
         members : [   // array ke andar individual user detail object
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName,
                }
            }
         ]      
   }
   console.log(JSON.stringify(data)) // ek line mein data ko daalegea

    const jsonData = JSON.stringify(data); // storing the data

    const url = "https://us21.api.mailchimp.com/3.0/lists/53079e5d6f"; //  endpoint api

    const options = {  // posting the data to server with the help of api key
        method : "POST",
        auth : "ankitx21:a16ed7103e990916b53ba286cabb10b-us21",
    }

    const request = https.request(url,options,function(response){ 

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/sucess.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data))
        })

    })
    request.write(jsonData) // writes the data to the server 
    request.end()
   
})

app.post("/failure",function(req,res){ // post the failure file to homepage = redirect
    res.redirect("/");
})



app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
})

// api key
// 6a16ed7103e990916b53ba286cabb10b-us21

// unique id : 53079e5d6f


