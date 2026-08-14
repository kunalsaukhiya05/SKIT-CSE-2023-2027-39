const mongoose = require("mongoose");

function DBConnection(){
    try{
        mongoose.connect(process.env.MONGO_URI).then(() => {console.log("DataBase Connected")}).catch((err) => {console.log("Error In DataBase Connection", err)});
    }catch(err){
        console.log(`Error in DB Connection`, err);
    }
}


module.exports = DBConnection;