import { useDispatch, useSelector } from 'react-redux'
import { checkVisibilityOfShareContentAction } from '../../redux-toolkit/features/shareExportSlice'
import defaultAvatar from '../../../images/default-avatar.png'
import { LiaSearchSolid } from 'react-icons/lia'

export const ExpertsToShareContentWith = () => {
  let dispatch = useDispatch()
  let { possibleToShareWith } = useSelector((store) => store.shareExport)
  return (
    <>
      <div className="search-people">
        <span>
          <LiaSearchSolid />
        </span>
        <input
          type="text"
          name="search-by-first-last-name"
          id="search-by-first-last-name"
          placeholder="Search by first/last name..."
        />
      </div>

      <div className="people-to-give-permission-container">
        <div className="people-to-give-permission">
          {possibleToShareWith.map((personToShareWith) => {
            let base64Photo = `data:image/png;base64,${personToShareWith.photoAsFile}`

            return (
              <div className="person-to-give-permission-container">
                <div className="permission-action">
                  <input
                    type="checkbox"
                    name="person-to-give-permission-checkbox"
                    id="person-to-give-permission-checkbox"
                    onClick={() => {
                      dispatch(checkVisibilityOfShareContentAction())
                    }}
                  />
                </div>

                <div className="person-to-give-permission-information">
                  <div className="person-to-give-permission-img-container">
                    <img
                      className="person-to-give-permission-img"
                      src={
                        personToShareWith.photoAsFile
                          ? base64Photo
                          : defaultAvatar
                      }
                      alt="Person photo"
                    />
                  </div>
                  <div className="person-to-give-permission-basic-information">
                    <input
                      type="hidden"
                      name="person-permission-info"
                      className="person-permission-info info-id"
                      value={personToShareWith.id}
                    />
                    <p
                      className="person-permission-info info-username"
                      title={personToShareWith.username}
                    >
                      {personToShareWith.username}
                    </p>
                    <p
                      className="person-permission-info info-role"
                      title={personToShareWith.roles[0].name}
                    >
                      {personToShareWith.roles[0].name}
                    </p>
                    <p
                      className="person-permission-info info-phoneNumber"
                      title={personToShareWith.phoneNumber}
                    >
                      {personToShareWith.phoneNumber}
                    </p>
                    <hr />
                    <p
                      className="person-permission-info info-organization"
                      title={personToShareWith.organization}
                    >
                      {personToShareWith.organization}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <p className="people-to-give-permission-count">
          Number of persons content is shared with
        </p>
      </div>
    </>
  )
}
