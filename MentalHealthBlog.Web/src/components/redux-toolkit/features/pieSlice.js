import { application } from "../../../application";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let initialState = {
  labels: [],
  rerendering: false,
  numberOfTags: [],
  statisticsData: null,
  statisticsLoading: false,
  statisticsFailed: false,
};

export const prepareForPieGraph = createAsyncThunk(
  "/statistics/pie",
  async (filteringObject) => {
    console.log("Filtering object ", filteringObject);
    let url = `${application.application_url}/statistics/pie?MonthOfPostCreation=${filteringObject.monthOfPostCreation}`;
    let request = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${filteringObject.loggedUser.token}`,
      },
    });
    let response = await request.json();
    return response;
  }
);

export const pieSlice = createSlice({
  name: "pieSlice",
  initialState,
  reducers: {
    setRerendering: (state) => {
      state.rerendering = true;
    },
  },
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

        state.labels = []; //Clearing previous data
        state.numberOfTags = []; //Clearing previous data
        if (
          (state.labels.length <= 0 && state.numberOfTags.length <= 0) ||
          state.rerendering === true
        ) {
          for (var i = 0; i < state.statisticsData.length; i++) {
            state.labels.push(state.statisticsData[i].tagName);
            state.numberOfTags.push(state.statisticsData[i].numberOfTags);
          }
        }
      });
  },
});

export const { setRerendering } = pieSlice.actions;

export default pieSlice.reducer;
