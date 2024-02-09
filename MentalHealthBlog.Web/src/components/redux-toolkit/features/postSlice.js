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

export const deletePostById = createAsyncThunk(
  "post/{id}",
  async (deletePostObj) => {
    console.log("DELETE OBJ", deletePostObj);
    let url = `${application.application_url}/post/${deletePostObj.post.id}`;
    let request = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${deletePostObj.loggedUser.token}`,
      },
    });
    let response = await request.json();
    return response;
  }
);

let postSlice = createSlice({
  name: "postSlice",
  initialState: {
    posts: [],
    post: null,
    isLoading: false,
    isSuccessful: false,
    isFailed: false,
  },
  reducers: {
    setPost: (state, action) => {
      state.post = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //--- getPosts
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.rejected, (state) => {
        state.isFailed = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload.serviceResponseObject;
      })

      //--- deleteById
      .addCase(deletePostById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePostById.rejected, (state) => {
        state.isFailed = true;
      })
      .addCase(deletePostById.fulfilled, (state, action) => {
        // state.posts = state.posts.filter(
        //   (p) => p.id !== action.payload.serviceResponseObject.id
        // );
        window.location.reload();
      });
  },
});

export const { setPost } = postSlice.actions;

export default postSlice.reducer;
