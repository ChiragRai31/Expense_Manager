import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Logo from './shared/Logo';
import { Button } from './ui/button';
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
const SignUp = () => {
    const [input, setInput] = React.useState({
        fullname: "",
        email: "",
        password: ""
    });
     const navigate = useNavigate(); 
    const changeHandler = (e) => {
        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const submitHandler = async (e) => {
        e.preventDefault();
    try{        
    const res= await axios.post("http://localhost:8000/api/v1/user/register",input,{
        header:{
            "Content-Type":"application/json"
        },
        withCredentials:true
    });
    console.log(res);
    if(res.data.success){
        toast.success(res.data.message);    
        navigate("/login");
    } 
    }
    catch(err){
      toast.error(err.response?.data?.message || "Something went wrong" );
    }
    }
  return (
    <div className="relative flex items-center justify-center w-screen h-screen bg-[#FFFFE4] overflow-hidden">
      {/* Wrapper around form and decorative images */}
      {/* <div className="relative flex items-center justify-center">
         */}
        {/* Hand image - top right, outside the form */}
        <img
          src="ImageofHand.png"
          alt="Hand illustration"
          className="absolute top-0 right-0 w-1/3 object-contain opacity-90"
        />

        {/* Sign-up form */}
         <form
        onSubmit={submitHandler}
        className="w-1/3 min-w-[350px] p-10 shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl relative z-10"
      ><div className="flex justify-center">
            <Logo />
          </div>
          <div className="space-y-4">
            <div>
              <Label className="py-2">Full Name</Label>
              <Input type="text" name="fullname"
              value={input.fullname}
              onChange={changeHandler}/>
            </div>
            <div>
              <Label className="py-2">Email</Label>
              <Input type="email" name="email" 
              value={input.email}
              onChange={changeHandler}/>
            </div>
            <div>
              <Label className="py-2">Password</Label>
              <Input type="password" name="password" 
              value={input.password}
              onChange={changeHandler}/>
            </div>
          </div>
          <Button className="w-full my-5  bg-[#D05F33] hover:bg-[#c0562d]">SignUp</Button>
          <p className='text-sm text-center'>Already have an account? <Link to='/login' className='text-[#44AC9E] font-semibold'>Login</Link></p>
        </form>

        {/* Guy image - bottom left, outside the form */}
        <img
          src="Guy.png"
          alt="Guy illustration"
          className="absolute bottom-0 left-0 object-contain opacity-90 w-24"
        />
      </div>
    // </div>
  );
};

export default SignUp;
