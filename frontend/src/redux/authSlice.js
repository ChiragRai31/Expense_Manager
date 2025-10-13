import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // isAuthenticated: false,
    user: null,
    loading: false,
    // error: null,
  },
  reducers: {   
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    // loginStart: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // }   
    // ,
    // loginSuccess: (state, action) => {
    //   state.isAuthenticated = true;
    //     state.user = action.payload;
    //     state.loading = false;
    //     state.error = null;
    // },
    // loginFailure: (state, action) => {
    //   state.loading = false;
    //     state.error = action.payload;
    //     state.isAuthenticated = false;
    //     state.user = null;
    // },
    // logout: (state) => {
    //   state.isAuthenticated = false;
    //     state.user = null;
    //     state.loading = false;
    //     state.error = null;
    // }
    },
});

export const {setLoading, setAuthUser} = authSlice.actions;
export default authSlice.reducer;