const mongoose=require('mongoose')

const PatientSchema=new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    password:String
})

const PatientModel=mongoose.model("patients",PatientSchema)
module.exports=PatientModel