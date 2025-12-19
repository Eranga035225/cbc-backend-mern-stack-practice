import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken';
import orderRouter from './routes/orderRouter.js';
import cors from 'cors';

let app = express(); 

app.use(cors());
app.use(bodyParser.json());

app.use (
  (req,res,next)=>{

    const tokenString = req.header("Authorization");
    if(tokenString != null){
      const token = tokenString.replace("Bearer ", "");
     
      jwt.verify(token, "eranga0352257111",
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

mongoose.connect("mongodb+srv://mern_user:0352257111@cluster0.a2so6hk.mongodb.net/?appName=Cluster0")
.then(()=>{
  console.log("Connected to database");
})



app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);


app.listen(5055, 
  () => 
    {
      console.log('Server is running on port 5055');
      
    }
  )

