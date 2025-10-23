import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import { application } from '../../application'
import { respondToAssignment } from '../../redux-toolkit/features/assignmentSlice'
import { openRespondToAssignment } from '../../redux-toolkit/features/modalSlice'
import { setContentValidationData } from '../../redux-toolkit/features/validationSlice'
import { checkInputDataValidity } from '../../utils/helper-methods/methods'

import RespondToAssignmentCSS from './RespondToAssignment.css'
import { toast } from 'react-toastify'

export const RespondToAssignment = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)

  let { pickedAssignment } = useSelector((store) => store.assignment)
  let { isRespondingToAssignment } = useSelector((store) => store.modal)
  let { contentValidationData } = useSelector((store) => store.validation)
  return (
    <Modal
      isOpen={isRespondingToAssignment}
      style={application.add_post_modal_style}
      appElement={document.getElementById('root')}
      onRequestClose={() => {
        dispatch(openRespondToAssignment(!isRespondingToAssignment))
      }}
      onAfterOpen={() => {
        dispatch(setContentValidationData({}))
      }}
    >
      <div className="respond-to-assignment-modal">
        <div className="respond-to-assignment-main-container">
          <div className="respond-to-assignment-content">
            <textarea
              className="respond-to-assignment-assignment-text form-field"
              placeholder="Unesite svoj odgovor ovdje"
              spellCheck={false}
              onBlur={(e) => {
                let content = e.target.value
                let isTitle = false
                let isContent = true
                let [isValid, validationMessages] = checkInputDataValidity(
                  content,
                  [],
                  isTitle,
                  isContent
                )

                dispatch(
                  setContentValidationData({
                    contentIsValid: isValid,
                    contentValidationMessages: validationMessages,
                  })
                )
              }}
            ></textarea>
          </div>

          {!contentValidationData?.contentIsValid && (
            <div className="validation-message-main-container">
              {contentValidationData?.contentValidationMessages?.map(
                (message, index) => {
                  return (
                    <p key={index} className="validation-message">
                      - {message}
                    </p>
                  )
                }
              )}
            </div>
          )}

          <div className="respond-to-assignment-actions-container">
            <button
              type="button"
              className="respond-to-assignment-action-add-assignment-button"
              onClick={(e) => {
                let content = e.target.value
                let isTitle = false
                let isContent = true
                let [isValid, validationMessages] = checkInputDataValidity(
                  content,
                  [],
                  isTitle,
                  isContent
                )

                dispatch(
                  setContentValidationData({
                    contentIsValid: isValid,
                    contentValidationMessages: validationMessages,
                  })
                )

                if (!contentValidationData?.contentIsValid) {
                  toast.error(
                    'Molimo Vas da slijedite upute prilikom popunjavanja polja!',
                    {
                      position: 'bottom-right',
                      autoClose: 5000,
                    }
                  )
                  return
                }

                let contentValue = document.querySelector(
                  '.respond-to-assignment-assignment-text'
                ).value
                let request = {
                  assignmentId: pickedAssignment?.id,
                  responseById: authenticatedUser?.id,
                  content: contentValue,
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
