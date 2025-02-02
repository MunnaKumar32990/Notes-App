import mongoose from "mongoose";

const { Schema } = mongoose;
const userSchema = new Schema({
    fullName:{type : String},
    email:{type : String,unique : true},
    password:{type : String},
    createdOn:{type: Date, default: new Date().getTime()},
});

export default mongoose.model("User", userSchema);
