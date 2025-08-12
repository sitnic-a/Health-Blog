import { useDispatch, useSelector } from 'react-redux'
import { openDeleteModal } from '../../redux-toolkit/features/modalSlice'
import { deletePostById } from '../../redux-toolkit/features/postSlice'
import { application } from '../../application'
import { toast } from 'react-toastify'
import Modal from 'react-modal'

import DeletePostConfirmationCSS from './DeletePostConfirmation.css'

export const DeletePostConfirmation = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isDeleteOpen } = useSelector((store) => store.modal)
  let { post } = useSelector((store) => store.post)

  let deletePostObj = {
    post: post,
    authenticatedUser,
  }

  return (
    <Modal
      isOpen={isDeleteOpen}
      style={application.modal_style}
      appElement={document.getElementById('root')}
      onRequestClose={() => dispatch(openDeleteModal(false))}
    >
      <div className="confirmation-container">
        <div className="confirmation-title">
          <h2>Are you sure you want to delete this post?</h2>
        </div>
        <div className="confirmation-actions">
          <button
            className="confirmation-action-delete"
            type="button"
            onClick={() => {
              dispatch(deletePostById(deletePostObj)).then((data) => {
                let statusCode = data?.payload?.StatusCode
                console.log('Status code ', statusCode)

                if (statusCode !== 200) {
                  if (statusCode === 404) {
                    toast.error("Post doesn't exist! Please refresh page.", {
                      position: 'bottom-right',
                    })
                    return
                  }
                }
                dispatch(openDeleteModal(false))
              })
            }}
          >
            Yes
          </button>
          <button
            className="confirmation-action-cancel"
            type="button"
            onClick={() => dispatch(openDeleteModal(false))}
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  )
}
