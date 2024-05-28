const mongoose=require('mongoose')

const AppointSchema=new mongoose.Schema({
    name:String,
    doctor:String,
    age:String,
    date:String,
    role:String
})

const AppointModel=mongoose.model("Appointment",AppointSchema)
module.exports=AppointModel;