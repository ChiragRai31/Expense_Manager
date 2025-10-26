import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Logo from './shared/Logo';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
import { persistStore } from 'redux-persist';
import store from '../redux/store';
const persistor = persistStore(store);
const Login = () => {
  const [input, setInput] = React.useState({
    email: "",
    password: ""
  });
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const changeHandler = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async(e) => {
    e.preventDefault();
    try{        
    const res= await api.post("/api/v1/user/login",input,{
        header:{
            "Content-Type":"application/json"
        },
        withCredentials:true
    });
    console.log(res);
    if(res.data.success){
      persistor.purge(); // clear old persisted data before saving new user
      dispatch(setAuthUser(res.data.user))
        toast.success(res.data.message);    
        navigate("/");
    } 
    }
    catch(err){
      console.log(err);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-screen h-screen bg-[#FFFFE4] overflow-hidden">
      
      {/* Boat image - top left, background decorative */}
      <img
        src="Boat.png"
        alt="Boat illustration"
        className="absolute top-0 right-0 w-1/3 object-contain opacity-90"
      />

      {/* Login form - popup style above image */}
      <form
        onSubmit={submitHandler}
        className="w-1/3 min-w-[350px] p-10 shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl relative z-10"
      >
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="space-y-5">
          <div>
            <Label className="py-2">Email</Label>
            <Input
              type="email"
              name="email"
              className="bg-white"
              value={input.email}
              onChange={changeHandler}
            />
          </div>
          <div>
            <Label className="py-2">Password</Label>
            <Input
              type="password"
              name="password"
              className="bg-white"
              value={input.password}
              onChange={changeHandler}
            />
          </div>
        </div>

        <Button className="w-full my-6 bg-[#D05F33] hover:bg-[#c0562d]">
          Login
        </Button>

        <p className="text-sm text-center text-gray-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#44AC9E] font-semibold">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
