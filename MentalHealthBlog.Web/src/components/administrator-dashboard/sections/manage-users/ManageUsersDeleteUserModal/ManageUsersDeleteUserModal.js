import { useDispatch, useSelector } from 'react-redux'
import { removeUserById } from '../../../../../redux-toolkit/features/adminSlice'
import { openDeleteModal } from '../../../../../redux-toolkit/features/modalSlice'
import Modal from 'react-modal'
import { application } from '../../../../../application'
import { toast } from 'react-toastify'

import ManageUsersDeleteUserModalCSS from './ManageUsersDeleteUserModal.css'

export const ManageUsersDeleteUserModal = ({ dbUser }) => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isDeleteOpen } = useSelector((store) => store.modal)

  return (
    <Modal
      isOpen={isDeleteOpen}
      style={application.modal_style}
      appElement={document.querySelector('.main-manage-users-container')}
      onRequestClose={() => {
        dispatch(openDeleteModal(false))
      }}
    >
      <div className="manage-users-delete-modal-content">
        <div className="manage-users-modal-title-container">
          <h2 className="manage-users-modal-title">
            Are you sure you want to delete this user?
          </h2>
        </div>
        <div className="manage-users-modal-actions">
          <button
            type="button"
            className="manage-users-modal-confirm-delete-button"
            onClick={() => {
              let objectWithData = {
                dbUser,
                authenticatedUser,
              }
              if (
                dbUser?.roles?.some(
                  (ur) => ur?.name === 'Psychologist / Psychotherapist'
                )
              ) {
                dispatch(removeUserById(objectWithData)).then((data) => {
                  let statusCode = data?.payload?.StatusCode
                  if (statusCode !== 200) {
                    if (statusCode === 400) {
                      toast.error("User don't exist! Check parameters!", {
                        position: 'bottom-right',
                      })
                      return
                    }
                    if (statusCode === 404) {
                      toast.error('User not deleted! Not found!', {
                        position: 'bottom-right',
                      })
                      return
                    }
                  }
                })
                dispatch(openDeleteModal(false))
                return
              }
              dispatch(removeUserById(objectWithData)).then((data) => {
                let statusCode = data?.payload?.StatusCode
                if (statusCode !== 200) {
                  if (statusCode === 400) {
                    toast.error("User don't exist! Check parameters!", {
                      position: 'bottom-right',
                    })
                    return
                  }
                  if (statusCode === 404) {
                    toast.error('User not deleted! Not found!', {
                      position: 'bottom-right',
                    })
                    return
                  }
                }
              })
              dispatch(openDeleteModal(false))
            }}
          >
            DELETE
          </button>
          <button
            type="button"
            className="manage-users-modal-abort-delete-button"
            onClick={() => dispatch(openDeleteModal(false))}
          >
            LEAVE
          </button>
        </div>
      </div>
    </Modal>
  )
}
