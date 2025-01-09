import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { application } from "../../../application";

let initialState = {
  newlyRegisteredMentalHealthExperts: [],
  numberOfNewlyRegisteredMentalHealthExperts: 0,
};

export const getNewRegisteredExperts = createAsyncThunk(
  "new-request",
  async () => {
    let url = `${application.application_url}/admin/new-request`;
    let request = await fetch(url);
    let response = await request.json();
    return response;
  }
);

let adminSlice = createSlice({
  initialState,
  name: "adminSlice",
  extraReducers: (builder) => {
    builder
      .addCase(getNewRegisteredExperts.pending, (state, action) => {
        console.log("New-Request: Pending...");
      })
      .addCase(getNewRegisteredExperts.fulfilled, (state, action) => {
        console.log("New-Request: Fullfilled");
        let serviceResponseObject = action.payload.serviceResponseObject;
        state.newlyRegisteredMentalHealthExperts = serviceResponseObject;
        state.numberOfNewlyRegisteredMentalHealthExperts =
          state.newlyRegisteredMentalHealthExperts.length;
      })
      .addCase(getNewRegisteredExperts.rejected, (state, action) => {
        console.log("New-Request: Rejected");
        console.log(action.payload);
      });
  },
});

export default adminSlice.reducer;
