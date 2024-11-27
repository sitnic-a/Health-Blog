import { useDispatch, useSelector } from "react-redux";
import { openExportModal } from "../../redux-toolkit/features/modalSlice";

export const ExportModal = () => {
  let dispatch = useDispatch();

  let { isExportOpen } = useSelector((store) => store.modal);
  let { postsToExport, isExported } = useSelector((store) => store.shareExport);

  return (
    isExportOpen && (
      <>
        <section className="export-modal-overlay">
          <section className="export-modal-container">
            <span
              className="share-export-close-modal-btn"
              onClick={() => {
                dispatch(openExportModal(!isExportOpen));
                let shareExportContainer = document.querySelector(
                  ".share-export-container"
                );
                shareExportContainer.style.display = "flex";
              }}
            >
              X
            </span>
            <div className="export-modal">
              <div className="export-modal-content">
                <h4>Exporting posts...</h4>
                <div className="export-modal-files-container">
                  {postsToExport.map((post) => {
                    return (
                      <div className="export-modal-file-wrapper">
                        <p>{post.title}</p>
                      </div>
                    );
                  })}
                </div>

                {isExported && (
                  <div className="export-modal-progress-bar">
                    <p>Successfully exported!</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </section>
      </>
    )
  );
};
