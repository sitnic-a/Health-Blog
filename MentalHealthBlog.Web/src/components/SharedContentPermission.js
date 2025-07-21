import { useSelector } from 'react-redux'
import useFetchLocationState from './custom/hooks/useFetchLocationState'
import { Navbar } from './shared/Navbar'
import { SharedContentPermissionExpertInfo } from './SharedContentPermissionExpertInfo'

import { SharedContentPermissionPosts } from './SharedContentPermissionPosts'

export const SharedContentPermission = () => {
  let { mentalHealthExpert } = useFetchLocationState()
  let { sharesPerMentalHealthExpert } = useSelector(
    (store) => store.regularUser
  )

  let content = sharesPerMentalHealthExpert.filter(
    (mhe) =>
      mhe?.mentalHealthExpertContentSharedWith?.id === mentalHealthExpert?.id
  )[0]?.sharedContent

  return (
    <div className="content-shared-with-mental-health-expert-main-container">
      <Navbar />
      <div className="content-shared-with-mental-health-expert-hero">
        {mentalHealthExpert && (
          <h2 className="content-shared-with-mental-health-expert-hero-title">
            <span className="content-shared-with-mental-health-expert-hero-username">
              {mentalHealthExpert?.firstName} {mentalHealthExpert?.lastName}{' '}
            </span>
            read permission list
          </h2>
        )}
        <p className="content-shared-with-mental-health-expert-title">
          Everything shared with mental health expert
        </p>
        <p className="content-shared-with-mental-health-expert-subtitle">
          Check the list below:
        </p>
      </div>
      <div className="content-shared-with-mental-health-expert-container">
        <SharedContentPermissionPosts />
        {content?.length > 0 && (
          <SharedContentPermissionExpertInfo
            mentalHealthExpert={mentalHealthExpert}
          />
        )}
      </div>
    </div>
  )
}
