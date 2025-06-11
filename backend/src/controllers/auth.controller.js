import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup=async(req,res)=>{
    const {email,fullName,password}=req.body;
    try{
        if(!fullName||!email||!password){
            return res.status(400).json({
                message:"Please provide all the required fields"
            })
        }
        if(password.length<8){
            return res.status(400).json({
                message: "password must have at least 8 characters "
            })
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"Email already exists"
            })
        }
        const salt=await bcrypt.genSalt(10);
       
        const hashedPassword=await bcrypt.hash(password,salt);
        
        const newUser=new User({
            fullName,
            email,
            password:hashedPassword
        });
       
        if(newUser){
            //generate jwt token
            generateToken(newUser._id,res);
            await newUser.save();
             res.status(200).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            })


        }
        else{
            return res.status(400).json({
                message:"Invalid user data"
            })
        }



    }catch(error){
        console.log("signup error ",error.message)
        return res.status(500).json({
            
            message:" Internal Server error"
        })
    }
        


    
}





export const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email||!password){
            return res.status(400).json({
                message:"Please provide all the required fields"
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invalid credentials"
            })

        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }
        generateToken(user._id,res);
        res.status(200).json({            
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })


    }catch(error){
        console.log("Error in login credentials",error.message)
        return res.status(500).json({
            message:"Internal Server error"
        })

    }
   
}











export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({
            message:"Logged out successfully"
        })


    }catch(error){
        console.log("logout error",error.message)
        return res.status(500).json({
            message:"Internal Server error"
        })
    }
    
}
export const updateProfile=async(req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId=req.user._id
        if(!profilePic){
            return res.status(400).json({
                message:"Please provide profile pic "
            })
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic)
        const updatedUser=await User.findByIdAndUpdate(userId,{
            profilePic:uploadResponse.secure_url
        },{new:true});
        res.status(200).json(updatedUser)



    }catch(error){
        console.log("updateProfile error",error.message)
        return res.status(500).json({
            message:"Internal Server error"
        })
    }
}


export const checkAuth=async(req,res)=>{
    try{
        res.status(200).json(req.user);
        
    }catch(error){
        console.log("checkAuth error",error.message)
        return res.status(500).json({
            message:"Internal Server error"
        })
    }

}