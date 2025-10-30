import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import moment from 'moment'
import {
  openAssignmentResponses,
  openRespondToAssignment,
} from '../../redux-toolkit/features/modalSlice'
import {
  getAssignmentResponses,
  resetData,
  setChosenAssignment,
} from '../../redux-toolkit/features/assignmentSlice'
import { application } from '../../application'

import { IoAddSharp } from 'react-icons/io5'

import AssignmentResponsesCSS from './AssignmentResponses.css'

export const AssignmentResponses = () => {
  let dispatch = useDispatch()
  // let { authenticatedUser } = useSelector((store) => store.user)
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { dbAssignmentResponses, pickedAssignment } = useSelector(
    (store) => store.assignment
  )
  let { isAssignmentResponsesOpen, isRespondingToAssignment } = useSelector(
    (store) => store.modal
  )
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
          authenticatedUser,
          assignmentObj,
        }

        dispatch(getAssignmentResponses(objectWithData))
      }}
      onRequestClose={() => {
        dispatch(openAssignmentResponses(!isAssignmentResponsesOpen))
        dispatch(setChosenAssignment({}))
        dispatch(resetData(null))
      }}
    >
      <div className="mental-health-experts-assignment-responses-modal">
        <div className="mental-health-experts-assignment-responses-modal-content">
          <div className="mental-health-experts-assignments-assignment-responses-actions-container">
            <IoAddSharp
              className="mental-health-experts-assignments-assignment-responses-action-add-response-icon"
              onClick={() => {
                dispatch(openRespondToAssignment(!isRespondingToAssignment))
              }}
            />
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
                {dbAssignmentResponses?.map((response) => {
                  let writtenAt = moment(response?.writtenAt).format(
                    'DD/MM HH:mm'
                  )
                  if (response?.responseById !== authenticatedUser?.id) {
                    return (
                      <div
                        key={response?.id}
                        className="mental-health-experts-assignments-assignment-responses-response-main-container"
                      >
                        <div className="assignment-responses-other-person">
                          <p className="mental-health-experts-assignments-assignment-responses-response-container-content-text">
                            {response?.content}
                          </p>
                          <p className="mental-health-experts-assignments-assignment-responses-response-container-content-date">
                            {writtenAt}
                          </p>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div
                        key={response?.id}
                        className="mental-health-experts-assignments-assignment-responses-response-main-container"
                      >
                        <div className="mental-health-experts-assignments-assignment-responses-response-container">
                          <p className="mental-health-experts-assignments-assignment-responses-response-container-content-text">
                            {response?.content}
                          </p>
                          <p className="mental-health-experts-assignments-assignment-responses-response-container-content-date">
                            {writtenAt}
                          </p>
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
