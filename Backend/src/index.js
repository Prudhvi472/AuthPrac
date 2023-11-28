require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dbConnect = require('./db/dbConnect')
const app = express()
const cookieParser = require('cookie-parser');
const router = require('./routes/index')

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

app.use(router)

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