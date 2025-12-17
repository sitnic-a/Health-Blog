import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { getMentalHealthExperts } from '../../redux-toolkit/features/mentalExpertSlice'
import {
  changeRequestStatus,
  getMyExperts,
  setExperts,
  setSelectedMentalHealthExpertIds,
} from '../../redux-toolkit/features/therapySlice'
import { stringIsNullOrEmpty } from '../../utils/helper-methods/methods'
import { requestStatuses } from '../../enums/requestStatuses'

import MentalHealthExpertsDropdownCSS from './MentalHealthExpertsDropdown.css'

export const MentalHealthExpertsDropdown = () => {
  let dispatch = useDispatch()
  // let { authenticatedUser } = useSelector((store) => store.user)
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

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
                key={
                  !stringIsNullOrEmpty(expert?.id)
                    ? expert?.id
                    : expert?.mentalHealthExpertId
                }
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

                  {expert?.requestStatus !== requestStatuses.APPROVED &&
                    expert?.requestStatus !== requestStatuses.PENDING &&
                    expert?.requestStatus !== null &&
                    expert?.requestStatus !== undefined && (
                      <button
                        className="main-mental-health-expert-picker-option-action picker-option-send-request-action"
                        type="button"
                        onClick={() => {
                          authenticatedUserLocalStorage =
                            localStorage.getItem('authenticatedUser')
                          authenticatedUser = JSON.parse(
                            authenticatedUserLocalStorage
                          )

                          let objectWithData = {
                            mentalHealthExpertUserId:
                              expert?.mentalHealthExpertUserId,
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

                                toast.success('Uspješno ste poslali zahtjev!', {
                                  autoClose: 1500,
                                  position: 'bottom-right',
                                })
                              }
                            }
                          )
                        }}
                      >
                        Pošalji zahtjev
                      </button>
                    )}

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

                          mainMentalHealthExpertSelectedPickerOption.classList.add(
                            'main-mental-health-expert-selected-picker-option-active'
                          )

                          optionAddAction.style.display = 'none'
                          optionCancelAction.style.display = 'initial'

                          selectedMentalHealthExpertIdsTemp = [
                            ...selectedMentalHealthExpertIdsTemp,
                            parseInt(pickedMentalHealthExpertId),
                          ]

                          dispatch(
                            setSelectedMentalHealthExpertIds(
                              selectedMentalHealthExpertIdsTemp
                            )
                          )
                          return
                        }}
                      >
                        + Dodaj
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
                    Odustani
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
