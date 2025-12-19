import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken';
import orderRouter from './routes/orderRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

let app = express(); 

app.use(cors()); // all are allowed
app.use(bodyParser.json());

app.use (
  (req,res,next)=>{

    const tokenString = req.header("Authorization");
    if(tokenString != null){
      const token = tokenString.replace("Bearer ", "");
     
      jwt.verify(token, process.env.JWT_KEY,
        (err, decoded)=>{
        if(decoded != null){
          req.user = decoded;
          next();
        }else{
          console.log("Invalid token");
          res.status(403).json({
            message : "Invalid token"
          });
        }
      })
    }else{
      next();
    }

  });

mongoose.connect(process.env.MONGODB_URI,)
.then(()=>{
  console.log("Connected to database");
})



app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);


app.listen(5055, 
  () => 
    {
      console.log('Server is running on port 5055');
      
    }
  )

