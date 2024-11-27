import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  openShareModal,
  openExportModal,
} from "../redux-toolkit/features/modalSlice";

import {
  exportToPDF,
  getExpertsAndRelatives,
} from "../redux-toolkit/features/shareExportSlice";

import {
  getSelectedPosts,
  base64ToArrayBuffer,
} from "../utils/helper-methods/methods";

import { FaShare } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa";

export const ShareExportOverlay = () => {
  let dispatch = useDispatch();
  let { isShareOpen, isExportOpen } = useSelector((store) => store.modal);
  let { postsToExport } = useSelector((store) => store.shareExport);

  let location = useLocation();
  let loggedUser = location.state.loggedUser;

  return (
    <section className="share-export-main-container share-export-position-out">
      <div className="share-export-container ">
        <section
          className="share-icon-container"
          onClick={() => {
            dispatch(openShareModal(!isShareOpen));
            let shareExportContainer = document.querySelector(
              ".share-export-container"
            );
            shareExportContainer.style.display = "none";
            dispatch(getExpertsAndRelatives());
            let selectedPosts = getSelectedPosts(loggedUser);
            console.log("In LIST on Share ", selectedPosts);

            // alert("Share activated");
          }}
        >
          <FaShare className="share-export-icon" />
        </section>

        <section
          className="export-icon-container"
          onClick={() => {
            // let postsToExport = getSelectedPosts();/
            dispatch(openExportModal(!isExportOpen));
            let shareExportContainer = document.querySelector(
              ".share-export-container"
            );
            shareExportContainer.style.display = "none";
            dispatch(exportToPDF(postsToExport)).then((response) => {
              var arrBuffer = base64ToArrayBuffer(response.payload.data);

              // It is necessary to create a new blob object with mime-type explicitly set
              // otherwise only Chrome works like it should
              var newBlob = new Blob([arrBuffer], {
                type: "application/pdf",
              });

              // For other browsers:
              // Create a link pointing to the ObjectURL containing the blob.
              var data = window.URL.createObjectURL(newBlob);

              var link = document.createElement("a");
              document.body.appendChild(link); //required in FF, optional for Chrome
              link.href = data;
              link.download = response.payload.fileName;
              link.click();
              window.URL.revokeObjectURL(data);
              link.remove();
            });
          }}
        >
          <FaFileExport className="share-export-icon" />
        </section>
      </div>
    </section>
  );
};
