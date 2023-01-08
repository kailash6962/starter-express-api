import express from "express";
import {readdirSync} from 'fs';
import cors from 'cors';//cross origin auth
const morgan = require("morgan"); //server logs
import mongoose from 'mongoose';//mongodb

require("dotenv").config(); //for env
try{
  
const app = express();

//db connection
mongoose.connect(process.env.DATABASE)
.then(() => console.log('DB Connected 2'))
.catch((err) => console.log('DB Connection Error: ', err));
console.log('Auth JS Check 1');

//middleware
app.use(cors());
app.use(morgan("prod"));
app.use(express.json());

//route middleware
readdirSync('./routes').map((r) => 
    app.use('/api', require(`./routes/${r}`))
);


const port = process.env.PORT || 8000;
app.listen(port, ()=> console.log(`Server is running on http://localhost:${port}/`));

} catch (error) {
    console.log(error);
}
