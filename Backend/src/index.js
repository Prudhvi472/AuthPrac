require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dbConnect = require('./db/dbConnect')
const User = require('./db/User')
const bcrypt = require('bcrypt')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

app.use(cookieParser())
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
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
  
      if (passwordMatch) {
        const accessToken = jwt.sign({ user: existingUser.user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
        // Set the access token as an HTTP-only cookie
        res.cookie('access_token', accessToken, {
          httpOnly: true,
          secure: true, // Set to true if using HTTPS
          sameSite: 'Strict', // Adjust based on your requirements
          expires: new Date(Date.now() + 3600000), // 1 hour expiration
        });
  
        return res.json({ success: true, message: 'Login successful'}).status(200);
      } else {
        return res.status(401).json({ success: false, message: 'Incorrect password' });
      }
    } catch (error) {
      console.error('Login error:', error);
  
      // Handle specific error scenarios
      if (error.name === 'ValidationError') {
        // Mongoose validation error (e.g., required field missing)
        return res.status(400).json({ success: false, message: error.message });
      }
  
      // Handle other unexpected errors
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

app.post('/login',login)




const register = async (req, res) => {
    try {
      console.log(req.body);
  
      // Validate request body
      if (!req.body.user || !req.body.password) {
        return res.status(400).json({ success: false, message: 'User and password are required fields' });
      }
  
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      // Create a new user
      const newUser = await User.create({ user: req.body.user, password: hashedPassword });
  
      return res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Registration error:', error);
  
      // Handle specific error scenarios
      if (error.name === 'ValidationError') {
        // Mongoose validation error (e.g., required field missing)
        return res.status(400).json({ success: false, message: error.message });
      }
  
      // Handle other unexpected errors
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  

app.post('/register',register)

const authenticateToken = (req, res, next) => {

    const token = req.cookies.access_token;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    });
  };

const findAllUsers = async (req,res) => {
    try {
        const users = await User.find({})
        res.status(201).json({users})
    } catch (error) {
        res.json({message:error}).status(401)
    }
}

app.get('/users',authenticateToken,findAllUsers)



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