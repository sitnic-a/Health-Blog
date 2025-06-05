import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { application } from "../../../application";
import { toast } from "react-toastify";

let initialState = {
  sharesPerMentalHealthExpert: [],
  recentShares: [],
  successfullyFetchedRecentShares: null,
  isLoading: false,
  successfullyFetchedSharesPerMentalHealthExpert: null,
};

export const getSharesPerMentalHealthExpert = createAsyncThunk(
  "shares-per-mental-health-expert",
  async (objectWithData) => {
    let url = `${application.application_url}/regularUser/shares-per-mental-health-expert?loggedUserId=${objectWithData.query.loggedUserId}`;
    let request = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    });
    let response = await request.json();
    return response;
  }
);

export const getRecentShares = createAsyncThunk(
  "recent",
  async (objectWithData) => {
    let url = `${application.application_url}/regularUser/recent?loggedUserId=${objectWithData.query.loggedUserId}`;
    let request = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    });
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
        state.isLoading = true;
      })
      .addCase(getSharesPerMentalHealthExpert.fulfilled, (state, action) => {
        let serviceResponseObject = action.payload.serviceResponseObject;
        let statusCode = action?.payload?.statusCode;
        state.isLoading = false;

        if (statusCode === 200) {
          state.successfullyFetchedSharesPerMentalHealthExpert = true;
          state.sharesPerMentalHealthExpert = serviceResponseObject;
          return;
        }
        state.successfullyFetchedSharesPerMentalHealthExpert = false;
      })
      .addCase(getSharesPerMentalHealthExpert.rejected, (state, action) => {
        state.isLoading = false;
        state.successfullyFetchedSharesPerMentalHealthExpert = false;
        toast.error("Something went wrong!", {
          position: "bottom-right",
        });
      })

      //recent
      .addCase(getRecentShares.pending, (state, action) => {
        console.log("Recent shares pending...");
        state.isLoading = true;
      })
      .addCase(getRecentShares.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode;
        let recentShares = action?.payload?.serviceResponseObject;
        state.isLoading = false;

        if (statusCode === 200) {
          state.recentShares = recentShares;
          state.successfullyFetchedRecentShares = true;
          return;
        }

        if (statusCode !== 200) {
          state.successfullyFetchedRecentShares = false;
          return;
        }
      })
      .addCase(getRecentShares.rejected, (state, action) => {
        toast.error("Something went wrong", {
          position: "bottom-right",
        });
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
