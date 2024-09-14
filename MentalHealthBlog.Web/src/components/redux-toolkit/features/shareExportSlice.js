import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSelectedPosts } from "../../utils/helper-methods/methods";
import { setIsSharingExporting } from "./postSlice";
import { application } from "../../../application";

let initialState = {
  postsToShare: [],
  postsToExport: [],
};

export const exportToPDF = createAsyncThunk(
  "/export",
  async (postsToExport) => {
    console.log("Posts to export ", postsToExport);
    let request = await fetch(`${application.application_url}/export`, {
      method: "POST",
      body: JSON.stringify(postsToExport),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let response = request.json();
    return response;
  }
);

let shareExportSlice = createSlice({
  name: "shareExportSlice",
  initialState,
  reducers: {
    setOverlayForShareExport: (state, action) => {
      let postsToShareExport = getSelectedPosts(action.payload);
      state.postsToExport = postsToShareExport;

      let main = document.querySelector("main");
      let shareExportBox = document.querySelector(
        ".share-export-main-container"
      );
      let selectDataButton = document.querySelector(
        "button[data-action-select='select']"
      );
      let uncheckReminder = document.querySelector(".reminder");

      if (state.postsToExport.length > 0) {
        uncheckReminder.style.opacity = "1";
        uncheckReminder.style.visibility = "visible";
        selectDataButton.setAttribute("disabled", "");
        selectDataButton.style.cursor = "not-allowed";

        main.classList.add("selecting");
        if (shareExportBox.classList.contains("share-export-position-out")) {
          shareExportBox.classList.remove("share-export-position-out");
          shareExportBox.classList.add("share-export-position-in");
        }
        let selecting = document.querySelector(".selecting");
        selecting.style.opacity = "1";
      } else {
        uncheckReminder.style.opacity = "0";
        uncheckReminder.style.visibility = "hidden";

        selectDataButton.removeAttribute("disabled");
        selectDataButton.style.cursor = "pointer";
        main.classList.remove("selecting");
        if (shareExportBox.classList.contains("share-export-position-in")) {
          shareExportBox.classList.remove("share-export-position-in");
          shareExportBox.classList.add("share-export-position-out");
        }
        setIsSharingExporting(false);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(exportToPDF.pending, (state) => {
        console.log("Pending");
      })
      .addCase(exportToPDF.fulfilled, (state, action) => {
        console.log("Successfully implemented");
      })
      .addCase(exportToPDF.rejected, (state, action) => {
        console.log("FAILED");
      });
  },
});

export const { setOverlayForShareExport } = shareExportSlice.actions;

export default shareExportSlice.reducer;
