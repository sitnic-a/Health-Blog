import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { application } from "../../../application";

let initialState = {
  sharesPerMentalHealthExpert: [],
  recentShares: [],
  isLoading: false,
};

export const getSharesPerMentalHealthExpert = createAsyncThunk(
  "shares-per-mental-health-expert",
  async (query) => {
    let url = `${application.application_url}/regularUser/shares-per-mental-health-expert?loggedUserId=${query.loggedUserId}`;
    let request = await fetch(url);
    let response = await request.json();
    return response;
  }
);

export const getRecentShares = createAsyncThunk("recent", async (query) => {
  console.log("Query sent ", query);
  let url = `${application.application_url}/regularUser/recent?loggedUserId=${query.loggedUserId}`;
  let request = await fetch(url);
  let response = await request.json();
  return response;
});

export const revokeContentPermission = createAsyncThunk(
  "revoke",
  async (revokeObject) => {
    console.log("Revoke ", revokeObject);

    let url = `${application.application_url}/regularUser/revoke`;
    let request = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(revokeObject),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let response = await request.json();
    return response;
  }
);

export const regularUserSlice = createSlice({
  initialState,
  name: "regularUser",
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder
      //shares-per-mental-health-expert
      .addCase(getSharesPerMentalHealthExpert.pending, (state, action) => {
        console.log("Shares per mental health expert pending... ");
        state.isLoading = true;
      })
      .addCase(getSharesPerMentalHealthExpert.fulfilled, (state, action) => {
        let serviceResponseObject = action.payload.serviceResponseObject;
        state.sharesPerMentalHealthExpert = serviceResponseObject;
        state.isLoading = false;
      })
      .addCase(getSharesPerMentalHealthExpert.rejected, (state, action) => {
        console.log("Shares per mental health expert ", action.payload);
        state.isLoading = false;
      })

      //recent
      .addCase(getRecentShares.pending, (state, action) => {
        console.log("Recent shares pending...");
        state.isLoading = true;
      })
      .addCase(getRecentShares.fulfilled, (state, action) => {
        console.log("Recent shares fulfilled");
        let recentShares = action.payload.serviceResponseObject;
        state.recentShares = recentShares;
        console.log("Recent ", recentShares);
        state.isLoading = false;
      })
      .addCase(getRecentShares.rejected, (state, action) => {
        console.log("Recent shares rejected ", action.payload);
        state.isLoading = false;
      })

      //revoke
      .addCase(revokeContentPermission.pending, (state, action) => {
        console.log("Revoke pending...");
      })
      .addCase(revokeContentPermission.fulfilled, (state, action) => {
        console.log("Permission to read deleted!");
      })
      .addCase(revokeContentPermission.rejected, (state, action) => {
        console.log("Revoke error ", action.payload);
      });
  },
});

export const { previewHoveredContentCounter, hideHoveredContentCounter } =
  regularUserSlice.actions;

export default regularUserSlice.reducer;
