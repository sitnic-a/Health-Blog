import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { application } from "../../../application";

let initialState = {
  usersThatSharedContent: [],
  sharedContent: [],
  sharesPerMentalHealthExpert: [],
  usersThatSharedIncludingItsContent: {},
  overlayPost: null,
};

export const getSharesPerUser = createAsyncThunk(
  "shares-per-user",
  async (query) => {
    let url = `${application.application_url}/mentalExpert/shares-per-user?LoggedExpertId=${query.loggedExpertId}`;
    let request = await fetch(url);
    let response = await request.json();

    return response;
  }
);

export const getSharesPerMentalHealthExpert = createAsyncThunk(
  "shares-per-mental-health-expert",
  async () => {
    let url = `${application.application_url}/mentalExpert/shares-per-mental-health-expert`;
    let request = await fetch(url);
    let response = await request.json();
    return response;
  }
);

export const mentalExpertSlice = createSlice({
  name: "mentalExpert",
  initialState,
  reducers: {
    getOnlyUsersThatSharedContent: (state, action) => {
      let response = action.payload.payload.serviceResponseObject;
      let usersThatSharedContent = [];

      if (response.length > 0) {
        response.map((obj) => {
          let responseUser = obj.userThatSharedContent;
          let userThatShared = {
            id: responseUser.id,
            username: responseUser.username,
          };
          usersThatSharedContent.push(userThatShared);
        });
        state.usersThatSharedContent = usersThatSharedContent;
      }
    },
    previewHoveredContentCounter: (state, action) => {
      let mentalHealthExpertId = action.payload.mentalHealthExpertId;

      let mentalHealthExpertContainers = document.querySelectorAll(
        ".shares-per-mental-health-expert-expert-main-container"
      );

      mentalHealthExpertContainers.forEach((mentalHealthExpertContainer) => {
        let containerKeyId = mentalHealthExpertContainer.querySelector(
          ".input-container-key"
        ).dataset.expertId;

        if (parseInt(containerKeyId) === mentalHealthExpertId) {
          mentalHealthExpertContainer.querySelector(
            ".posts-counter-paragraph"
          ).style.opacity = "1";
          mentalHealthExpertContainer.querySelector(
            ".posts-counter-paragraph"
          ).style.cursor = "pointer";
        }
      });
    },
    hideHoveredContentCounter: (state, action) => {
      let mentalHealthExpertId = action.payload.mentalHealthExpertId;

      let mentalHealthExpertContainers = document.querySelectorAll(
        ".shares-per-mental-health-expert-expert-main-container"
      );

      mentalHealthExpertContainers.forEach((mentalHealthExpertContainer) => {
        let containerKeyId = mentalHealthExpertContainer.querySelector(
          ".input-container-key"
        ).dataset.expertId;

        if (parseInt(containerKeyId) === mentalHealthExpertId) {
          mentalHealthExpertContainer.querySelector(
            ".posts-counter-paragraph"
          ).style.opacity = "0";
          mentalHealthExpertContainer.querySelector(
            ".posts-counter-paragraph"
          ).style.cursor = "pointer";
        }
      });
    },
    getSharedContentOfPickedUser: (state, action) => {
      let userId = action.payload.userId;
      let response =
        action.payload.usersThatSharedIncludingItsContent.serviceResponseObject;
      let pickedObj = response.find(
        (u) => u.userThatSharedContent.id === userId
      );
      state.sharedContent = [...pickedObj.sharedContent];
    },
    setOverlayPost: (state, action) => {
      console.log(action.payload);

      let contentPost = action.payload;
      if (contentPost !== null || contentPost !== undefined) {
        state.overlayPost = contentPost;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //shares-per-user
      .addCase(getSharesPerUser.pending, () => {
        console.log("Pending request for shares per user");
      })
      .addCase(getSharesPerUser.fulfilled, (state, action) => {
        state.usersThatSharedIncludingItsContent = action.payload;
      })
      .addCase(getSharesPerUser.rejected, (action) => {
        console.log("Request rejected ", action.payload);
      })

      //shares-per-mental-health-expert
      .addCase(getSharesPerMentalHealthExpert.pending, (state, action) => {
        console.log("Shares per mental health expert pending... ");
      })
      .addCase(getSharesPerMentalHealthExpert.fulfilled, (state, action) => {
        let serviceResponseObject = action.payload.serviceResponseObject;
        state.sharesPerMentalHealthExpert = serviceResponseObject;
      })
      .addCase(getSharesPerMentalHealthExpert.rejected, (state, action) => {
        console.log("Shares per mental health expert ", action.payload);
      });
  },
});

export const {
  getOnlyUsersThatSharedContent,
  previewHoveredContentCounter,
  hideHoveredContentCounter,
  getSharedContentOfPickedUser,
  setOverlayPost,
} = mentalExpertSlice.actions;
export default mentalExpertSlice.reducer;
