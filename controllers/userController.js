import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";


dotenv.config();

export function createUser(req,res){

  if(req.body.role == "admin"){
    if(req.user != null){
      if(req.user.role != "admin"){
        res.status(403).json({
          message : "You are not authorized to create admin accounts"
        })
        return

      }
    }else{
      res.status(403).json({
        message : "You are not authorized to create admin accounts.Please log in"
      })
      return
    }
  }
//
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = new User({
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    password : hashedPassword,
    role : req.body.role,

  });


  user.save().then(()=>{

    res.json({
      message : "User created successfully"
    })
  })
  .catch(()=>{
    res.json({
      message : "Failed to create the user"
    })
  })
}


export function loginUser(req,res){
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email : email}).then(
    (user)=>{
      if(user == null){
        res.status(404).json({
          message : "user not found"
        })
      }else{
         
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if(isPasswordCorrect){
          const token = jwt.sign({
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName,
            role : user.role,
            img : user.img
          },
          process.env.JWT_KEY,
        )
          res.json({
            message : "Log in successful",
            token : token,
            role: user.role

          })
        }else{
          res.status(401).json({
            message : "Invalid Password"
          })
        }
          
        }
      }
    )
    }

    //function for to check wthere is a an admin
  
export function isAdmin(req){
  if(req.user == null){
    return false;
   
  }

  if(req.user.role != "Admin"){
    return  false;
  }

  return true;
}


export async function loginWithGoogle(req, res) {
  try {
    const token = req.body.accessToken;

    if (!token) {
      return res.status(403).json({
        message: "Please log in with Google",
      });
    }

    // ✅ CALL GOOGLE API
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const user = await User.findOne({
      email: googleRes.data.email,
    })

    if(user==null){

      const newUser = new User({
        email: googleRes.data.email,
        firstName: googleRes.data.given_name,
        lastName: googleRes.data.family_name,
        password: "googleUser",
        img: googleRes.data.picture
      })

      await newUser.save();

      const token = jwt.sign({
        email : newUser.email,
        firstName : newUser.firstName,
        lastName : newUser.lastName,
        role : newUser.role,
        img : newUser.img
      },
      process.env.JWT_KEY,
    )


    }else{
      const token = jwt.sign({
        email : user.email,
        firstName : user.firstName,
        lastName : user.lastName,
        role : user.role,
        img : user.img
      },
      process.env.JWT_KEY,
    )

    res.json({
      message : "Log in successful",
      token : token,
      role: user.role

    })  
    }
  } catch (error) {
    console.error("Google login error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Google authentication failed",
    });
  }
}

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // Gmail APP PASSWORD
  },
});

  
export async function sendOTP(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }
  const user = await User.findOne({
    email: email
  })

  if(user==null){
    return res.status(404).json({
      message: "User not found",
    });
  }


  await OTP.deleteMany({
    email: email
  })

  


  const randomOtp = Math.floor(100000 + Math.random() * 900000);
  const message = {
    from: `"Beauty Cosmetics" <${process.env.EMAIL}>`,
    to: email,
    subject: "OTP Verification for Beauty Cosmetics",
    text: `This is your OTP: ${randomOtp}`,
  };

  const otp = new OTP({
    email: email,
    otp: randomOtp
  })

  await otp.save()

  transport.sendMail(message, (error, info) => {
    if (error) {
      console.error("OTP email error:", error);
      return res.status(500).json({
        message: "Failed to send OTP",
        error: error.message,
      });
    }

    res.json({
      message: "OTP sent successfully",
      randomOtp, // ⚠️ REMOVE THIS IN PRODUCTION
    });
  });
}

export async function resetPassword(req,res){

  const otp = req.body.otp;
  const email = req.body.email;
  const newPassword = req.body.newPassword;

  const res = await OTP.findOne({
    email: email
  })
  if(res== null){
    return res.status(404).json({
      message: "User not found",
    });


  }






}