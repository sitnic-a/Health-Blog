import { useDispatch, useSelector } from 'react-redux'
import { openExportModal } from '../../../redux-toolkit/features/modalSlice'
import { BiError } from 'react-icons/bi'
import { MdOutlineDownloadDone } from 'react-icons/md'

export const ExportModal = () => {
  let dispatch = useDispatch()

  let { isExportOpen } = useSelector((store) => store.modal)
  let { postsToExport, isExported, isLoading } = useSelector(
    (store) => store.shareExport
  )

  return (
    isExportOpen && (
      <>
        <section className="export-modal-overlay">
          <section className="export-modal-container">
            <span
              className="share-export-close-modal-btn"
              onClick={() => {
                dispatch(openExportModal(!isExportOpen))
                let shareExportContainer = document.querySelector(
                  '.share-export-container'
                )
                shareExportContainer.style.display = 'flex'
              }}
            >
              X
            </span>
            <div className="export-modal">
              <div className="export-modal-content">
                <h4 className="export-modal-content-title">
                  Exporting posts...
                </h4>
                <div className="export-modal-files-container">
                  {postsToExport?.map((post) => {
                    return (
                      <div key={post?.id} className="export-modal-file-wrapper">
                        <p className="export-modal-file-file-name">
                          {post?.title}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {isLoading === true ? (
                  <p className="export-modal-content-title">
                    Please wait, document is exporting...
                  </p>
                ) : (
                  <>
                    {isExported && (
                      <div className="export-modal-progress-container">
                        <div className="export-modal-successfully-exported-container">
                          <MdOutlineDownloadDone className="export-modal-exported-success-icon" />
                          <p className="export-modal-exported-description">
                            Successfully exported!
                          </p>
                        </div>
                      </div>
                    )}

                    {!isExported && (
                      <div className="export-modal-progress-container">
                        <div className="export-modal-not-exported-container">
                          <BiError className="export-modal-not-exported-error-icon" />
                          <p className="export-modal-not-exported-description">
                            Document couldn't be exported!
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </section>
      </>
    )
  )
}
