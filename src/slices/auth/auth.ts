import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../lib/API";
import ProcessError from "../../lib/error";
import authService from "./auth.service";

const initialState = {
    user: {},
    isLoading: false,
    expires_in: 0,
    error: "",
};


export const register = createAsyncThunk("auth/register", async (user: Record<string, string>, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/auth/register`, user);

      authService.setUserAndAuth(data);
  
      // if (data.data.email) {
      //   window.location.href = "/tickets";
      //   return data.data;
      // }
    } catch (error) {
      console.log(error)
      const err = ProcessError(error);
      return rejectWithValue(err);
    }
});


export const login = createAsyncThunk("auth/login", async (user: Record<string, string>, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/auth/login`, user);
  
      authService.setUserAndAuth(data);
  
      // if (data.data.email) {
      //   window.location.href = "/tickets";
      //   return data.data;
      // }
    } catch (error) {
      console.log(error)
      const err = ProcessError(error);
      console.log(err)
      return rejectWithValue(err?.message);
    }
});


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      reset: (state) => {
        state.isLoading = false;
        state.error = "";
      },
      setUser: (state, action) => {
        state.user = action.payload;
      },
      setExpiry: (state, action) => {
        state.expires_in = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(register.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
          state.error = "";
        })
        .addCase(register.rejected, (state, action) => {
          state.isLoading = false;
          state.user = {};
          state.error = `${action.payload}`;
        })
        .addCase(login.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false;
          state.user = {};
          state.error = `${action.payload}`;
        })
        // .addCase(meQuery.pending, (state) => {
        //   state.isLoading = false;
        // })
        // .addCase(meQuery.fulfilled, (state, action) => {
        //   state.isLoading = false;
        //   state.isSuccess = true;
        //   state.user = action.payload;
        // })
        // .addCase(meQuery.rejected, (state, action) => {
        //   state.isLoading = false;
        //   state.isError = true;
        //   state.user = {};
        //   state.message = JSON.stringify(action.payload);
        // })

    },
});

const { actions, reducer } = authSlice;
export const { reset, setUser, setExpiry } = actions;

export default reducer;