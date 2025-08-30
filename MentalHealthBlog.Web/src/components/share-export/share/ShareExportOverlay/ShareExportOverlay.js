import { useDispatch, useSelector } from 'react-redux'
import {
  openShareModal,
  openExportModal,
} from '../../../../redux-toolkit/features/modalSlice'
import {
  exportToPDF,
  getExpertsAndRelatives,
} from '../../../../redux-toolkit/features/shareExportSlice'
import {
  getSelectedPosts,
  base64ToArrayBuffer,
} from '../../../../utils/helper-methods/methods'

import { FaShare } from 'react-icons/fa'
import { FaFileExport } from 'react-icons/fa'
import { toast } from 'react-toastify'

import ShareExportOverlayCSS from './ShareExportOverlay.css'
import { requestStatuses } from '../../../../enums/requestStatuses'

export const ShareExportOverlay = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isShareOpen, isExportOpen } = useSelector((store) => store.modal)
  let { postsToExport } = useSelector((store) => store.shareExport)

  return (
    <section className="share-export-main-container share-export-position-out">
      <div className="share-export-container ">
        <section
          className="share-icon-container"
          onClick={() => {
            dispatch(openShareModal(!isShareOpen))
            let shareExportContainer = document.querySelector(
              '.share-export-container'
            )
            shareExportContainer.style.display = 'none'
            let objectWithData = {
              loggedUserId: authenticatedUser?.id,
              requestStatus: requestStatuses.APPROVED,
              authenticatedUser,
            }
            dispatch(getExpertsAndRelatives(objectWithData)).then((data) => {
              let statusCode = data?.payload?.StatusCode
              if (statusCode !== 200) {
                if (statusCode === 404) {
                  toast.error("Experts couldn't be fetched!", {
                    position: 'bottom-right',
                  })
                  return
                }
              }
              if (
                data?.payload?.statusCode === 200 &&
                data?.payload?.serviceResponseObject?.length === 0
              ) {
                toast.warning('Reach some mental health expert first!', {
                  position: 'bottom-right',
                })
                return
              }

              toast.success('Successfuly retrieved experts!', {
                position: 'bottom-right',
              })
            })
            let selectedPosts = getSelectedPosts(authenticatedUser)
            console.log('In LIST on Share ', selectedPosts)
          }}
        >
          <FaShare className="share-export-icon" />
        </section>

        <section
          className="export-icon-container"
          onClick={() => {
            dispatch(openExportModal(!isExportOpen))
            let shareExportContainer = document.querySelector(
              '.share-export-container'
            )
            shareExportContainer.style.display = 'none'

            let objectWithData = {
              postsToExport,
              authenticatedUser,
            }

            dispatch(exportToPDF(objectWithData)).then((response) => {
              let statusCode = response?.payload?.StatusCode
              let fileLength = response?.payload?.fileLength
              console.log('File ', fileLength)

              if (statusCode !== 200 && fileLength === undefined) {
                toast.error('Document is not exported! Try again!', {
                  position: 'bottom-right',
                })
                return
              }

              var arrBuffer = base64ToArrayBuffer(response.payload.data)

              // It is necessary to create a new blob object with mime-type explicitly set
              // otherwise only Chrome works like it should
              var newBlob = new Blob([arrBuffer], {
                type: 'application/pdf',
              })

              // For other browsers:
              // Create a link pointing to the ObjectURL containing the blob.
              var data = window.URL.createObjectURL(newBlob)

              var link = document.createElement('a')
              document.body.appendChild(link) //required in FF, optional for Chrome
              link.href = data
              link.download = response.payload.fileName
              link.click()
              window.URL.revokeObjectURL(data)
              link.remove()
            })
          }}
        >
          <FaFileExport className="share-export-icon" />
        </section>
      </div>
    </section>
  )
}
