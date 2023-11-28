const User = require('../db/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


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
  
        res.cookie('access_token', accessToken, {
          httpOnly: true,
          secure: true, 
          sameSite: 'Strict', 
          expires: new Date(Date.now() + 3600000), 
        });
  
        return res.json({ success: true, message: 'Login successful'}).status(200);
      } else {
        return res.status(401).json({ success: false, message: 'Incorrect password' });
      }
    } catch (error) {
      console.error('Login error:', error);
  
      
      if (error.name === 'ValidationError') {
      
        return res.status(400).json({ success: false, message: error.message });
      }
  
      
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };



  const register = async (req, res) => {
    try {
      console.log(req.body);
  
      
      if (!req.body.user || !req.body.password) {
        return res.status(400).json({ success: false, message: 'User and password are required fields' });
      }
  
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      
      const newUser = await User.create({ user: req.body.user, password: hashedPassword });
  
      return res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Registration error:', error);
  
      
      if (error.name === 'ValidationError') {
        
        return res.status(400).json({ success: false, message: error.message });
      }
  
  
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  const proteced = (req,res) =>{
    return res.status(201).json({ success: true, message: 'User logged in successfully', user: req.user });
  }

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


module.exports = {
    login,
    register,
    authenticateToken,
    findAllUsers,
    proteced
}