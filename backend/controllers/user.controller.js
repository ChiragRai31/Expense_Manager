import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try{
    const { fullname, email, password} = req.body;
    if(!fullname || !email || !password){
      return res.status(400).json({ message: "All fields are required",
        success: false
       })    };
       const user= await User.findOne({email});
       if(user){
        return res.status(400).json({ message: "User already exists with this email",
        success: false
       })  
       };    
       const hashedPassword= await bcrypt.hash(password,10);
       await User.create({
        fullname,
        email,
        password:hashedPassword
       });
       return res.status(201).json({ message: "Account created successfully",
        success: true
       })
} catch (error) {
    console.error(error);    
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        };
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        };
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id,
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: '1d'});
       return res.status(200).cookie("token", token, {
  httpOnly: true,
  secure: true,            // 🔥 required for HTTPS (Render)
  sameSite: "none",        // 🔥 required for cross-domain cookie
  maxAge: 24 * 60 * 60 * 1000 // 1 day
}).json({
  message: `Welcome back ${user.fullname}`,
  success: true,
  user: {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
  }
});



    } catch (error) {
        console.error(error);
    }
}
export const logout = async (req, res) => {
    try {
       return res.status(200).cookie("token", "", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  expires: new Date(0)
}).json({

            message: "Logged out successfully",
            success: true,
        })
    }catch (error) {
        console.error(error);
    }
}