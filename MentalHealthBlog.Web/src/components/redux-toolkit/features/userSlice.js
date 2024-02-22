import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { application } from "../../../application";
import { toast } from "react-toastify";

let initialState = {
  isLoading: false,
  isLogging: false,
  isFailed: false,
  quote: null,
  authenticatedUser: null,
  isAuthenticated: false,
  isRegistered: false,
  statusCode: null,
};

export const getQuote = createAsyncThunk("quote", async () => {
  let url = "https://type.fit/api/quotes";
  let request = await fetch(url);
  let response = request.json();
  return response;
});

export const login = createAsyncThunk("/user/login", async (user) => {
  console.log("User on submit ", user);
  let url = `${application.application_url}/user/login`;
  let request = await fetch(url, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
  let response = await request.json();
  console.log("Response ", response);
  return response;
});

export const register = createAsyncThunk("/user/register", async (user) => {
  console.log("User on submit ", user);
  let url = `${application.application_url}/user/register/${user.username}/${user.password}`;
  let request = await fetch(url, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
  let response = await request.json();
  return response;
});

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setIsFailed: (state, action) => {
      state.isFailed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      //--- login
      .addCase(login.pending, (state) => {
        state.isLogging = true;
        state.isLoading = true;
      })
      .addCase(login.rejected, (state) => {
        state.isFailed = true;
        state.isAuthenticated = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.statusCode = action.payload.statusCode;
        if (state.statusCode === 200) {
          state.authenticatedUser = action.payload.serviceResponseObject;
          state.isLogging = false;
          state.isLoading = false;
          state.isAuthenticated = true;
          // console.log("Logged succesfully ", action.payload);
          return;
        }
        if (
          state.statusCode !== 200 ||
          state.statusCode !== 201 ||
          state.statusCode !== 204
        ) {
          toast.error("Invalid credentials, try again", {
            autoClose: 1500,
            position: "bottom-right",
          });
          // console.log("Logged unsuccessfully");
          state.isLoading = false;
          state.isLogging = false;
          state.isAuthenticated = false;
          state.authenticatedUser = null;
          return;
        }
      })

      //--- register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isRegistered = false;
      })
      .addCase(register.rejected, (state) => {
        state.isFailed = true;
        state.isRegistered = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log("Register fulfilled ", action.payload);
        state.statusCode = action.payload.statusCode;
        if (state.statusCode === 201) {
          toast.success("You've successfully created an account", {
            autoClose: 1500,
            position: "bottom-right",
          });
          state.isRegistered = true;
          state.isLoading = false;
          return;
        }
        if (
          state.statusCode !== 200 ||
          state.statusCode !== 201 ||
          state.statusCode !== 204
        ) {
          toast.error("Couldn't register this user", {
            autoClose: 1500,
            position: "bottom-right",
          });
          // console.log("Logged unsuccessfully");
          state.isLoading = false;
          return;
        }
      })

      //--- getQuote
      .addCase(getQuote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuote.rejected, (state) => {
        state.isFailed = true;
      })
      .addCase(getQuote.fulfilled, (state, action) => {
        // console.log("Get quote ", action.payload);
        let response = action.payload;
        let arraySize = response.length;
        let randomNumber = Math.floor(Math.random() * arraySize) + 1;
        let obj = { ...response[randomNumber] };
        state.quote = {
          text: obj.text,
          author: obj.author,
        };
        //console.log("Quote object ", obj);
      });
  },
});

export const { setIsFailed } = userSlice.actions;
export default userSlice.reducer;
