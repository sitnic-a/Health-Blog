import { createSlice } from "@reduxjs/toolkit";
import { getSelectedPosts } from "../../utils/helper-methods/methods";
import { setIsSharingExporting } from "./postSlice";

let initialState = {
  postsToShare: [],
  postsToExport: [],
};

let shareExportSlice = createSlice({
  name: "shareExportSlice",
  initialState,
  reducers: {
    setOverlayForShareExport: () => {
      let postsToShareExport = getSelectedPosts();

      let main = document.querySelector("main");
      let shareExportBox = document.querySelector(
        ".share-export-main-container"
      );
      let selectDataButton = document.querySelector(
        "button[data-action-select='select']"
      );
      let uncheckReminder = document.querySelector(".reminder");

      if (postsToShareExport.length > 0) {
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
});

export const { setOverlayForShareExport } = shareExportSlice.actions;

export default shareExportSlice.reducer;
