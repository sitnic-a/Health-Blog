import { MdEmail, MdLocalPhone } from 'react-icons/md'

import SharedContentPermissionExpertInfoCSS from './SharedContentPermissionExpertInfo.css'

export const SharedContentPermissionExpertInfo = ({ mentalHealthExpert }) => {
  let base64Photo = `data:image/png;base64, ${mentalHealthExpert?.photoAsFile}`

  return (
    <div className="content-shared-with-mental-health-expert-expert-info-container">
      <div className="content-shared-with-mental-health-expert-expert-photo-container">
        <img
          className="content-shared-with-mental-health-expert-photo"
          src={base64Photo}
          alt={`${mentalHealthExpert?.firstName} ${mentalHealthExpert?.lastName}`}
        />
      </div>

      <div className="content-shared-with-mental-health-expert-expert-contact-info">
        <div className="content-shared-with-mental-health-expert-phone-container">
          <MdLocalPhone className="person-to-share-with-phone-icon" />
          <p
            className="content-shared-with-mental-health-expert-phone-value"
            title={mentalHealthExpert?.phoneNumber}
          >
            {mentalHealthExpert?.phoneNumber}
          </p>
        </div>
        <div className="content-shared-with-mental-health-expert-email-container">
          <MdEmail />
          <p
            className="content-shared-with-mental-health-expert-email-value"
            title={mentalHealthExpert?.email}
          >
            {mentalHealthExpert?.email}
          </p>
        </div>

        <hr />

        <div className="content-shared-with-mental-health-expert-organization-container">
          <p
            className="content-shared-with-mental-health-expert-organization-value"
            title={mentalHealthExpert?.organization}
          >
            {mentalHealthExpert?.organization}
          </p>
        </div>
      </div>
    </div>
  )
}
