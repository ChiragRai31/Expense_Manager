import React from "react";
import Logo from "./shared/Logo";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import api from "../lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { persistStore } from 'redux-persist';
import store from "../redux/store";

const persistor = persistStore(store);
const NavBar = () => {
  const {user} = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await api.get("/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        persistor.purge();

        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className=" shadow-sm bg-white">
      <div className="flex items-center justify-between p-4">
        {/* Left side: Logo */}
        <Logo />

        {/* Right side: Auth buttons or Avatar */}
        {user ? (
          <Popover>
            <PopoverTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" className="w-full">
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={logoutHandler}
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="space-x-3">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
