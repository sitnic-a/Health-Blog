import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { application } from "../../../application";

let initialState = {
  suggestedTags: [],
  displayedSuggestedTags: [],
  chosenTags: [],
  pickedTags: [],
};

export const getTags = createAsyncThunk("tag/", async () => {
  let url = `${application.application_url}/tag`;
  let request = await fetch(url);
  let response = await request.json();
  return response;
});

let tagSlice = createSlice({
  name: "tagSlice",
  initialState,
  reducers: {
    setSuggestedTags: (state, action) => {
      state.suggestedTags = action.payload;
    },
    setDisplayedSuggestedTags: (state, action) => {
      state.displayedSuggestedTags = action.payload;
    },
    setChosenTags: (state, action) => {
      state.chosenTags = action.payload;
    },
    setPickedTags: (state, action) => {
      state.pickedTags = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //getAllTags
      .addCase(getTags.fulfilled, (state, action) => {
        // console.log("Payload ", action.payload);
        state.suggestedTags = action.payload.serviceResponseObject;
      });
  },
});

export const {
  setSuggestedTags,
  setDisplayedSuggestedTags,
  setChosenTags,
  setPickedTags,
} = tagSlice.actions;

export default tagSlice.reducer;
