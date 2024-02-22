import { application } from "../../../application";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let initialState = {
  labels: [],
  numberOfTags: [],
  statisticsData: null,
  statisticsLoading: false,
  statisticsFailed: false,
};

export const prepareForPieGraph = createAsyncThunk(
  "/statistics/pie",
  async (loggedUser) => {
    let url = `${application.application_url}/statistics/pie`;
    let request = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedUser.token}`,
      },
    });
    let response = await request.json();
    return response;
  }
);

export const pieSlice = createSlice({
  name: "pieSlice",
  initialState,
  extraReducers: (builder) => {
    builder

      ///--- prepareForPieGraph
      .addCase(prepareForPieGraph.pending, (state) => {
        state.statisticsLoading = true;
      })
      .addCase(prepareForPieGraph.rejected, (state) => {
        state.statisticsFailed = true;
      })
      .addCase(prepareForPieGraph.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        let data = action.payload.serviceResponseObject;
        state.statisticsData = [...data];
        if (state.labels.length <= 0 && state.numberOfTags.length <= 0) {
          for (var i = 0; i < state.statisticsData.length; i++) {
            state.labels.push(state.statisticsData[i].tagName);
            state.numberOfTags.push(state.statisticsData[i].numberOfTags);
          }
        }
      });
  },
});

export default pieSlice.reducer;
