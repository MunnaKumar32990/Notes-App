import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/user.model.js';

import Note from './models/note.model.js';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './utilities.js';
mongoose.connect(process.env.connectionString);



const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (_req, res) => {
    res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName) {
        return res.status(400).json({ error: "Please enter your full name" });
    }
    if (!email) {
        return res.status(400).json({ error: "Please enter your email" });
    }
    if (!password) {
        return res.status(400).json({ error: "Please enter your password" });
    }

    const isUser = await User.findOne({ email: email });
    if (isUser) {
        return res.status(400).json({ error: "Email already exists" });
    }

    const user = new User({
        fullName,
        email,
        password,
    });
    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful"
    });
});

app.post("/login",async(req, res)=>{
    const {email, password} = req.body;

    if(!email){
        return res.status(400).json({error: "Please enter your email" });
    }
    if(!password){
        return res.status(400).json({error: "Please enter your password" });
    }
    const userInfo = await User.findOne({email: email});

        if (!userInfo){
            return res.status(400).json({message: "User not found"})
        }
   
        if (userInfo.email == email && userInfo.password== password){
            const user= {user : userInfo};
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m",
        });
        
        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({ error: true, message: "Invalid Email or Password" });
    }
});

// Get User

app.get("/get-user",authenticateToken,async (req, res) => {
    const {user} = req.user;
    const isUser = await User.findOne({_id: user._id});
    if(!isUser){
        return res.sendStatus(401);
        }   
        return res.json({
            user: {fullName: isUser.fullName, email: isUser.email,"_id": isUser._id,createdOn: isUser.createdOn},
            message:"",
        });
})

// Add Note
app.post("/add-note",authenticateToken, async (req, res) => {
    const {title, content , tags} = req.body;
    const {user} = req.user;

    if(!title){
        return res.status(400).json({ error: true, message: "Please enter your title" });
    }
    if(!content){
        return res.status(400).json({ error: true, message: "Please enter your content" });
    }
    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note Added Successfully",
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});
// Edit Note
app.put("/edit-note/:noteId",authenticateToken, async (req, res) => {
    const noteId =req.params.noteId;
    const {title, content , tags , isPinned} = req.body;
    const {user} = req.user;

    if(!title && !content && !tags){
        return res.status(400).json({ error: true, message: "no changes provided"});
    }
     try{
        const note = await Note.findOne( {_id: noteId, userId:user._id});

        if(!note){
            return res.status(404).json({ error: true, message: "Note not found"});
            }
        if(title) note.title=title;
        if(content) note.content=content;
        if(tags) note.tags=tags;
        if(isPinned) note.isPinned=isPinned;
        await note.save();
        return res.json({
            error: false,
            note,
            message:"Note updated successfully",
            });
}
catch (error){
    return res.status(500).json({ error: true, message: "Internal Server Error"})
}
})

// Get All Note
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            notes,
            message: "All Notes Retrieved Successfully",
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        await note.deleteOne({ _id: noteId, userId: user._id });
        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// update isPinned value

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {

    const noteId = req.params.noteId;
    const {isPinned}=req.body;
    const { user } = req.user;

        try {
            const note = await Note.findOne({ _id: noteId, userId: user._id });
            if (!note) {
                return res.status(404).json({ error: true, message: "Note not found"
                    });
                    }
             note.isPinned=isPinned;

            await note.save();
            return res.json({
                error: false,
                message: "Note updated successfully",
                });
                } catch (error) {
                    return res.status(500).json({ error: true, message: "Internal Server Error"
                        });


    }

})

//Search Notes
app.get("/search-notes/", authenticateToken, async (req, res)=>{
const {user}= req.user;
const {query}  = req.query;

if(!query){
    return res.status(400).json({error:true,message:"Please enter a search query"})
}
try{
    const matchingNotes = await Note.find({
        userId: user._id,
        $or: [
            {title: { $regex:new RegExp(query, "i") } },
            {content: { $regex:new RegExp(query, "i") }},
        ]
    })
    return res.json({
        error: false,
        notes: matchingNotes,
        message: "Notes retrieved successfully",
    });
} catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
}
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

export default app;
