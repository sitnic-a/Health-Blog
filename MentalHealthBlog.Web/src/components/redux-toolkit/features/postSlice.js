import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { application } from "../../../application";

export const getPosts = createAsyncThunk("post/", async (loggedUser) => {
  let url = `${application.application_url}/post?UserId=${loggedUser.id}`;
  let request = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loggedUser.token}`,
    },
  });
  let response = await request.json();
  return response;
});

let postSlice = createSlice({
  name: "postSlice",
  initialState: {
    posts: [],
    isLoading: false,
    isSuccessful: false,
    isFailed: false,
  },
  extraReducers: (builder) => {
    //--- getPosts method
    builder
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.rejected, (state) => {
        state.isFailed = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload.serviceResponseObject;
      });
  },
});

export default postSlice.reducer;
