import { Link } from 'react-router-dom'
export const NewMentalHealthExpertRequests = () => {
  return (
    <div className="actions-container-requests">
      <Link to={'approve/expert'}>
        New Mental Health Experts <span>Expert indicator</span>
      </Link>
    </div>
  )
}
