import { Link } from 'react-router-dom'
export const Requests = () => {
  return (
    <div className="requests-main-container">
      <Link
        to={'/requests/new-experts'}
        className="request-link new-mental-health-expert-request-link"
      >
        <span className="new-mental-health-expert-request-container-notification">
          6
        </span>

        <div className="new-mental-health-expert-request-container">
          <p className="new-mental-health-expert-request-container-label">
            Mental Health Experts
          </p>
          <p className="new-mental-health-expert-request-container-info">
            Newly registered:
            <span className="new-mental-health-expert-request-container-number-of-registered">
              6
            </span>
          </p>
        </div>
      </Link>
    </div>
  )
}
