import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { application } from "../../../application";

let initialState = {
  sharesPerMentalHealthExpert: [],
};

export const getSharesPerMentalHealthExpert = createAsyncThunk(
  "shares-per-mental-health-expert",
  async () => {
    let url = `${application.application_url}/regularUser/shares-per-mental-health-expert`;
    let request = await fetch(url);
    let response = await request.json();
    return response;
  }
);

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
      })
      .addCase(getSharesPerMentalHealthExpert.fulfilled, (state, action) => {
        let serviceResponseObject = action.payload.serviceResponseObject;
        state.sharesPerMentalHealthExpert = serviceResponseObject;
      })
      .addCase(getSharesPerMentalHealthExpert.rejected, (state, action) => {
        console.log("Shares per mental health expert ", action.payload);
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
