import { useDispatch, useSelector } from 'react-redux'

import {
  changeRequestStatus,
  getMyExperts,
  setExperts,
  setSelectedMentalHealthExpertIds,
} from '../../redux-toolkit/features/therapySlice'
import { requestStatuses } from '../../enums/requestStatuses'

import MentalHealthExpertsDropdownCSS from './MentalHealthExpertsDropdown.css'
import { getMentalHealthExperts } from '../../redux-toolkit/features/mentalExpertSlice'
import { toast } from 'react-toastify'

export const MentalHealthExpertsDropdown = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { suggestedMentalHealthExperts } = useSelector(
    (store) => store.mentalExpert
  )
  let { selectedMentalHealthExpertIds } = useSelector((store) => store.therapy)

  return (
    <div className="select-mental-health-experts-main-container">
      <div
        id="main-mental-health-expert-picker"
        className="main-mental-health-expert-picker-shrinked"
      >
        {suggestedMentalHealthExperts?.map((expert) => {
          let fullName = `${expert?.firstName} ${expert?.lastName}`
          return (
            expert?.requestStatus === requestStatuses.PENDING ||
            expert?.requestStatus === requestStatuses.APPROVED || (
              <div
                key={expert?.userId}
                className="main-mental-health-expert-selected-picker-option"
              >
                <div className="main-mental-health-expert-picker-option main-mental-health-expert-picker-option-expanded">
                  <input
                    id="main-mental-health-expert-picker-option-id"
                    type="hidden"
                    placeholder={expert?.userId}
                    value={expert?.userId}
                  />
                  <span className="main-mental-health-expert-picker-option-name">
                    {fullName}{' '}
                  </span>

                  {(expert?.requestStatus !== requestStatuses.APPROVED &&
                    expert?.requestStatus !== requestStatuses.PENDING &&
                    expert?.requestStatus !== null) ||
                    (expert?.requestStatus !== undefined && (
                      <button
                        className="main-mental-health-expert-picker-option-action picker-option-send-request-action"
                        type="button"
                        onClick={() => {
                          let objectWithData = {
                            mentalHealthExpertId: expert?.mentalHealthExpertId,
                            regularUserId: authenticatedUser?.id,
                            newRequestStatus: requestStatuses.PENDING,
                            authenticatedUser,
                            userSendingRequest: true,
                          }

                          dispatch(changeRequestStatus(objectWithData)).then(
                            (data) => {
                              let statusCode = data?.payload?.statusCode
                              if (statusCode === 200) {
                                objectWithData = {
                                  authenticatedUser,
                                  loggedUserId: authenticatedUser?.id,
                                }

                                dispatch(getMentalHealthExperts(objectWithData))

                                objectWithData = {
                                  loggedUserId: authenticatedUser?.id,
                                }
                                dispatch(getMyExperts(objectWithData))

                                toast.success('Succesfully made request!', {
                                  position: 'bottom-right',
                                  autoClose: 1500,
                                })
                              }
                            }
                          )
                        }}
                      >
                        Send request
                      </button>
                    ))}

                  {expert?.requestStatus === requestStatuses.UNDEFINED ||
                    expert?.requestStatus === requestStatuses.PENDING ||
                    expert?.requestStatus === requestStatuses.DECLINED || (
                      <button
                        className="main-mental-health-expert-picker-option-action picker-option-add-action"
                        type="button"
                        onClick={(e) => {
                          let mainMentalHealthExpertSelectedPickerOption =
                            e.currentTarget.parentNode.parentNode

                          let pickedMentalHealthExpertId =
                            mainMentalHealthExpertSelectedPickerOption.querySelector(
                              '#main-mental-health-expert-picker-option-id'
                            ).value

                          let optionAddAction =
                            mainMentalHealthExpertSelectedPickerOption.querySelector(
                              '.picker-option-add-action'
                            )
                          let optionCancelAction =
                            mainMentalHealthExpertSelectedPickerOption.querySelector(
                              '.picker-option-cancel-action'
                            )

                          let selectedMentalHealthExpertIdsTemp = [
                            ...selectedMentalHealthExpertIds,
                          ]

                          console.log(
                            'NEW selected ',
                            selectedMentalHealthExpertIdsTemp
                          )

                          mainMentalHealthExpertSelectedPickerOption.classList.add(
                            'main-mental-health-expert-selected-picker-option-active'
                          )

                          optionAddAction.style.display = 'none'
                          optionCancelAction.style.display = 'initial'

                          selectedMentalHealthExpertIdsTemp = [
                            ...selectedMentalHealthExpertIdsTemp,
                            parseInt(pickedMentalHealthExpertId),
                          ]

                          console.log(
                            'New array ',
                            selectedMentalHealthExpertIdsTemp
                          )

                          dispatch(
                            setSelectedMentalHealthExpertIds(
                              selectedMentalHealthExpertIdsTemp
                            )
                          )
                          return
                        }}
                      >
                        + Add
                      </button>
                    )}
                  <button
                    className="main-mental-health-expert-picker-option-action picker-option-cancel-action"
                    type="button"
                    onClick={(e) => {
                      let mainMentalHealthExpertSelectedPickerOption =
                        e.currentTarget.parentNode.parentNode

                      let pickedMentalHealthExpertId =
                        mainMentalHealthExpertSelectedPickerOption.querySelector(
                          '#main-mental-health-expert-picker-option-id'
                        ).value

                      let optionAddAction =
                        mainMentalHealthExpertSelectedPickerOption.querySelector(
                          '.picker-option-add-action'
                        )
                      let optionCancelAction =
                        mainMentalHealthExpertSelectedPickerOption.querySelector(
                          '.picker-option-cancel-action'
                        )

                      let selectedMentalHealthExpertIdsTemp = [
                        ...selectedMentalHealthExpertIds,
                      ]

                      mainMentalHealthExpertSelectedPickerOption.classList.remove(
                        'main-mental-health-expert-selected-picker-option-active'
                      )

                      optionCancelAction.style.display = 'none'
                      optionAddAction.style.display = 'initial'

                      selectedMentalHealthExpertIdsTemp = [
                        ...selectedMentalHealthExpertIdsTemp,
                      ].filter(
                        (mentalHealthExpert) =>
                          mentalHealthExpert !==
                          parseInt(pickedMentalHealthExpertId)
                      )

                      dispatch(
                        setSelectedMentalHealthExpertIds(
                          selectedMentalHealthExpertIdsTemp
                        )
                      )
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )
          )
        })}
      </div>
    </div>
  )
}
