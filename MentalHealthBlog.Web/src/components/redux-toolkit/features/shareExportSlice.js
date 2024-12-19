import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getSelectedPosts,
  getPeopleToShareContentWith,
} from "../../utils/helper-methods/methods";
import { setIsSharingExporting } from "./postSlice";
import { application } from "../../../application";
import { toast } from "react-toastify";

let initialState = {
  postsToShare: [],
  postsToExport: [],
  exportedDocument: null,
  isExported: false,
  possibleToShareWith: [],
  isSharingLink: false,
  shareLinkUrl: "",
  isLoading: false,
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

export const shareByLink = createAsyncThunk(
  "share/link/{shareId}",
  async (shareGuid) => {
    let url = `${application.application_url}/share/link/${shareGuid}`;
    let request = await fetch(url);
    let response = await request.json();
    return response;
  }
);

export const shareContent = createAsyncThunk(
  "/share",
  async (contentToBeShared) => {
    let request = await fetch(`${application.application_url}/share`, {
      method: "POST",
      body: JSON.stringify(contentToBeShared),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let response = request.json();
    return response;
  }
);

export const getExpertsAndRelatives = createAsyncThunk(
  "/share/experts-relatives",
  async () => {
    console.log("Get expert and relatives users invoked...");
    let url = `${application.application_url}/share/experts-relatives`;
    let request = await fetch(url);
    let response = request.json();
    console.log("Response in slice ", response);

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

    revokeShareContent: (state, action) => {
      state.postsToExport = state.postsToExport.filter(
        (post) => post.id !== action.payload
      );
      toast.success("The post is removed from list to share  ", {
        autoClose: 2000,
        position: "bottom-right",
      });
    },

    checkVisibilityOfShareContentAction: () => {
      if (getPeopleToShareContentWith().length > 0) {
        let shareBtn = document.querySelector(".share-btn-experts");
        shareBtn.style.display = "inline-block";
      } else {
        let shareBtn = document.querySelector(".share-btn-experts");
        shareBtn.style.display = "none";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //Export
      .addCase(exportToPDF.pending, (state) => {
        console.log("Pending");
      })
      .addCase(exportToPDF.fulfilled, (state, action) => {
        console.log("Successfully implemented");
        state.isExported = true;
        console.log("Payload ---- ", action.payload);

        state.exportedDocument = action.payload;
      })
      .addCase(exportToPDF.rejected, (state, action) => {
        console.log("FAILED");
      })

      .addCase(shareByLink.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(shareByLink.fulfilled, (state, action) => {
        state.postsToShare = action.payload;
        state.isLoading = false;
      })
      .addCase(shareByLink.rejected, (state, action) => {
        state.isLoading = false;
      })

      //Share
      .addCase(shareContent.pending, (state, action) => {
        console.log("Pending...");
        let contentToBeShared = action.meta.arg;

        if (contentToBeShared.shareLink === true) {
          state.isSharingLink = true;
        }
      })
      .addCase(shareContent.fulfilled, (state, action) => {
        if (state.isSharingLink === true) {
          let sharedContent = action.payload;
          if (sharedContent.length > 0) {
            let shareId = sharedContent[0].shareGuid;
            let host = window.location.origin;
            state.shareLinkUrl = `${host}/share/link/${shareId}`;
          }
        }

        toast.success("You have succesfully shared content!", {
          autoClose: 2000,
          position: "bottom-right",
        });
      })
      .addCase(shareContent.rejected, () => {
        toast.error("Something went wrong. Try again!", {
          autoClose: 2000,
          position: "bottom-right",
        });
      })

      //get suggested experts or relatives
      .addCase(getExpertsAndRelatives.pending, (state, action) => {
        console.log("Started with get experts and relatives...");
      })
      .addCase(getExpertsAndRelatives.fulfilled, (state, action) => {
        console.log("Get experts and relatives succesfully finished");
        console.log("Case gER payload ", action.payload);
        state.possibleToShareWith = action.payload;
      })
      .addCase(getExpertsAndRelatives.rejected, (state, action) => {
        console.log("Get experts and relatives rejected");
      });
  },
});

export const {
  setOverlayForShareExport,
  revokeShareContent,
  checkVisibilityOfShareContentAction,
} = shareExportSlice.actions;

export default shareExportSlice.reducer;
