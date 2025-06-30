import { useDispatch, useSelector } from 'react-redux'
import { checkIfShareContentActionIsDisabled } from '../../redux-toolkit/features/shareExportSlice'

import defaultAvatar from '../../../images/default-avatar.png'
import { MdPhone, MdEmail } from 'react-icons/md'

export const ExpertsToShareContentWith2 = () => {
  let dispatch = useDispatch()
  let { possibleToShareWith } = useSelector((store) => store.shareExport)
  return (
    <div className="share-modal-people-to-share-with">
      {possibleToShareWith?.map((personToShareWith) => {
        let fullName = `${personToShareWith?.firstName} ${personToShareWith?.lastName}`
        let base64Photo = `data:image/png;base64,${personToShareWith?.photoAsFile}`
        return (
          <div
            className="person-to-share-with-main-container"
            key={personToShareWith?.userId}
          >
            <input
              type="hidden"
              name="person-permission-info"
              className="person-permission-info info-id"
              value={personToShareWith.id}
            />
            <input
              className="person-to-share-content-with-checkbox"
              type="checkbox"
              name="person-to-share-content-with-checkbox"
              onClick={() => {
                dispatch(checkIfShareContentActionIsDisabled())
              }}
            />
            <div className="person-to-share-with-container">
              <div className="person-to-share-with-img-container">
                <img
                  className="person-to-share-with-img"
                  src={base64Photo ? base64Photo : defaultAvatar}
                  alt="Person"
                />
              </div>

              <div className="person-to-share-with-header-info-container">
                <h3 className="person-to-share-with-name">{fullName}</h3>
                <p className="person-to-share-with-role">
                  {personToShareWith?.roles[0].name}
                </p>
              </div>

              <div className="person-to-share-with-additional-info-container">
                <div className="person-to-share-with-additional-info-field person-to-share-with-phone-field">
                  <MdPhone className="person-to-share-with-phone-icon" />
                  <p
                    className="person-to-share-with-phone-value"
                    title={personToShareWith?.phoneNumber}
                  >
                    {personToShareWith?.phoneNumber}
                  </p>
                </div>

                <div className="person-to-share-with-additional-info-field person-to-share-with-email-field">
                  <MdEmail className="person-to-share-with-email-icon" />
                  <p
                    className="person-to-share-with-email-value"
                    title={personToShareWith?.email}
                  >
                    {personToShareWith?.email}
                  </p>
                </div>

                <hr />

                <div className="person-to-share-with-additional-info-field person-to-share-with-organization-field">
                  <p className="person-to-share-with-organization-value">
                    {personToShareWith?.organization}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
