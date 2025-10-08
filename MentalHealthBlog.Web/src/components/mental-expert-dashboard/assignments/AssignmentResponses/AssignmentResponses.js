import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux'
import { openAssignmentResponses } from '../../../../redux-toolkit/features/modalSlice'
import { getAssignmentResponses } from '../../../../redux-toolkit/features/assignmentSlice'
import { application } from '../../../../application'

import { IoAddSharp } from 'react-icons/io5'

import AssignmentResponsesCSS from './AssignmentResponses.css'

export const AssignmentResponses = () => {
  let dispatch = useDispatch()
  let { dbAssignmentResponses, pickedAssignment } = useSelector(
    (store) => store.assignment
  )
  let { isAssignmentResponsesOpen } = useSelector((store) => store.modal)

  return (
    <Modal
      isOpen={isAssignmentResponsesOpen}
      style={application.assignments_modal_style}
      appElement={document.getElementById('root')}
      onAfterOpen={() => {
        let assignmentObj = {
          id: pickedAssignment?.id,
        }
        let objectWithData = {
          assignmentObj,
        }

        dispatch(getAssignmentResponses(objectWithData))
      }}
      onRequestClose={() => {
        dispatch(openAssignmentResponses(!isAssignmentResponsesOpen))
      }}
    >
      <div className="mental-health-experts-assignment-responses-modal">
        <div className="mental-health-experts-assignment-responses-modal-content">
          <div className="mental-health-experts-assignments-assignment-responses-actions-container">
            <IoAddSharp className="mental-health-experts-assignments-assignment-responses-action-add-response-icon" />
          </div>
          <div className="mental-health-experts-assignment-responses-main-container">
            <div className="mental-health-experts-assignment-responses-assignment-content">
              <p className="mental-health-experts-assignment-responses-assignment-content-text">
                {pickedAssignment?.content}
              </p>
            </div>
            <div className="mental-health-experts-assignments-assignment-responses-main-container">
              <p className="mental-health-experts-assignments-assignment-responses-title">
                Odgovori:
              </p>
              <div className="mental-health-experts-assignments-assignment-responses-container">
                {dbAssignmentResponses.map((response) => {
                  return (
                    <div className="mental-health-experts-assignments-assignment-responses-response-main-container">
                      <p>{response?.content}</p>
                      <span>{response?.writtenAt}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
