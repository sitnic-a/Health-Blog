import { useDispatch, useSelector } from 'react-redux'
import { openExportModal } from '../../../../redux-toolkit/features/modalSlice'
import { BiError } from 'react-icons/bi'
import { MdOutlineDownloadDone } from 'react-icons/md'

import ExportModalCSS from './ExportModal.css'

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
                  Eksport postova...
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
                    Molimo sačekajte, dokument se eksportuje...
                  </p>
                ) : (
                  <>
                    {isExported && (
                      <div className="export-modal-progress-container">
                        <div className="export-modal-successfully-exported-container">
                          <MdOutlineDownloadDone className="export-modal-exported-success-icon" />
                          <p className="export-modal-exported-description">
                            Uspješno eksportovan dokument!
                          </p>
                        </div>
                      </div>
                    )}

                    {!isExported && (
                      <div className="export-modal-progress-container">
                        <div className="export-modal-not-exported-container">
                          <BiError className="export-modal-not-exported-error-icon" />
                          <p className="export-modal-not-exported-description">
                            Dokument nije moguće eksportovati! Ukoliko se
                            problem nastavi, molimo da se obratite se
                            korisničkoj podršci!
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
