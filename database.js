const mongoose=require("mongoose");
const jwt=require('jsonwebtoken')
const { stringify } = require("nodemon/lib/utils");
const bcrypt=require("bcryptjs")
const dotenv=require("dotenv")
const path=require("path")
//config
dotenv.config({path:"./config.env"})


exports.connectMongoose=()=>{
    mongoose.connect("mongodb://localhost:27017/userdb")
    .then((e)=>console.log(`connected to mongodb:${e.connection.host}`))
    .catch((e)=>console.log(e));

};
//voter option choose schema
const voteOfUser = new mongoose.Schema({
option:{type:String,required:true,}

})

//user login schema
const userSchema=new mongoose.Schema({
    name:String,
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:[true,"please enter your password"]
    }
});
//admins schema
const adminLog=new mongoose.Schema({
    name:String,
  username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:[true,"please enter your password"]
    }
})
//jwt token
/* userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}; */


/* userSchema.pre("save",async function(next){
if(!this.isModified("password")){
    next();
}
    this.password= await bcrypt.hash(this.password,10)
}) */

exports.User=mongoose.model("User",userSchema);
exports.Votes=mongoose.model("Votes",voteOfUser);
exports.Admin=mongoose.model("admins",adminLog);