import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { application } from "../../../application";
import { toast } from "react-toastify";

let initialState = {
  posts: [],
  post: null,
  isLoading: false,
  isSuccessful: false,
  isFailed: false,
};

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

export const createPost = createAsyncThunk("post/add/", async (addPostObj) => {
  let url = `${application.application_url}/post`;
  addPostObj.e.preventDefault();
  let form = new FormData(addPostObj.e.target);
  let data = Object.fromEntries([...form.entries()]);

  let newPost = {
    title: data.title,
    content: data.content,
    userId: addPostObj.loggedUser.id,
    tags: addPostObj.chosenTags,
  };

  if (
    newPost.title === "" ||
    newPost.title === null ||
    newPost.content === "" ||
    newPost.content === null
  ) {
    return;
  }

  let request = await fetch(url, {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-Type": "application/json",
    },
  });
  let response = await request.json();
  return response;
});

export const deletePostById = createAsyncThunk(
  "post/delete/{id}",
  async (deletePostObj) => {
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
  initialState,
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

      //addPost
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.rejected, (state) => {
        state.isFailed = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        window.location.reload();
      })

      //--- deleteById
      .addCase(deletePostById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePostById.rejected, (state) => {
        state.isFailed = true;
        toast.error("Couldn't delete post", {
          autoClose: 1500,
          position: "bottom-right",
        });
      })
      .addCase(deletePostById.fulfilled, (state, action) => {
        // state.posts = state.posts.filter(
        //   (p) => p.id !== action.payload.serviceResponseObject.id
        // );
        toast.success("Succesfully deleted post", {
          autoClose: 1500,
          position: "bottom-right",
        });
        window.location.reload();
      });
  },
});

export const { setPost } = postSlice.actions;

export default postSlice.reducer;
