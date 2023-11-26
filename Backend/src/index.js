require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dbConnect = require('./db/dbConnect')
const User = require('./db/User')
const bcrypt = require('bcrypt')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  app.use(cors(corsOptions));
  app.options('/register', cors(corsOptions));


  const login = async (req, res) => {
    try {
        const { user, password } = req.body;

        const existingUser = await User.findOne({ user });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (passwordMatch) {
            return res.json({ success: true, message: "Login successful"}).status(200);
        } else {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

app.post('/login',login)




const register = async (req,res) =>{
    try {
        console.log(req.body)
        const hashedPassword  = await bcrypt.hash(req.body.password,10)
        const newUser = await User.create({user:req.body.user , password : hashedPassword})
        return res.json({ success: true, message: "Login successful"}).status(200);
    } catch (error) {
        res.json({message:error}).status(500)
    }
}

app.post('/register',register)





const start = async () =>{
    try {
        await dbConnect(process.env.MONGO_URI)
        console.log('connected to db')
    } catch (error) {
        console.log(error);
    }
}


app.listen(3000,()=>{
    console.log("listening on port 3000")
})

start()