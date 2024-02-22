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
  loginStatusCode: null,
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
        state.loginStatusCode = action.payload.statusCode;
        if (state.loginStatusCode === 200) {
          state.authenticatedUser = action.payload.serviceResponseObject;
          state.isLogging = false;
          state.isLoading = false;
          state.isAuthenticated = true;
          // console.log("Logged succesfully ", action.payload);
          return;
        }
        if (
          state.loginStatusCode !== 200 ||
          state.loginStatusCode !== 201 ||
          state.loginStatusCode !== 204
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
