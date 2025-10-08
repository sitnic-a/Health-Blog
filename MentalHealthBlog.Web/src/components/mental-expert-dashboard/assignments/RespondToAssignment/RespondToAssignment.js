import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import { application } from '../../../../application'
import { respondToAssignment } from '../../../../redux-toolkit/features/assignmentSlice'
import { openRespondToAssignment } from '../../../../redux-toolkit/features/modalSlice'

import RespondToAssignmentCSS from './RespondToAssignment.css'

export const RespondToAssignment = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)

  let { pickedAssignment } = useSelector((store) => store.assignment)
  let { isRespondingToAssignment } = useSelector((store) => store.modal)
  return (
    <Modal
      isOpen={isRespondingToAssignment}
      style={application.add_post_modal_style}
      onRequestClose={() => {
        dispatch(openRespondToAssignment(!isRespondingToAssignment))
      }}
    >
      <div className="respond-to-assignment-modal">
        <div className="respond-to-assignment-main-container">
          <div className="respond-to-assignment-content">
            <textarea
              className="respond-to-assignment-assignment-text form-field"
              placeholder="Unesite svoj odgovor ovdje"
            ></textarea>
          </div>

          <div className="respond-to-assignment-actions-container">
            <button
              type="button"
              className="respond-to-assignment-action-add-assignment-button"
              onClick={() => {
                let content = document.querySelector(
                  '.respond-to-assignment-assignment-text'
                ).value
                let request = {
                  assignmentId: pickedAssignment?.id,
                  responseById: authenticatedUser?.id,
                  content: content,
                }
                let objectWithData = {
                  authenticatedUser,
                  request,
                }
                dispatch(respondToAssignment(objectWithData)).then((data) => {
                  dispatch(openRespondToAssignment(!isRespondingToAssignment))
                })
              }}
            >
              Odgovori
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
