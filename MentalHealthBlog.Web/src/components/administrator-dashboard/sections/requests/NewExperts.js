import { useSelector } from 'react-redux'

import { NewMentalHealthExpertProfile } from './NewMentalHealthExpertProfile'
import { ToastContainer } from 'react-toastify'
export const NewExperts = () => {
  let { newlyRegisteredMentalHealthExperts } = useSelector(
    (store) => store.admin
  )
  console.log(newlyRegisteredMentalHealthExperts)

  return (
    <>
      {newlyRegisteredMentalHealthExperts.length > 0 ? (
        <div className="new-experts-main-container">
          {newlyRegisteredMentalHealthExperts.map((expert) => {
            return (
              <NewMentalHealthExpertProfile key={expert.id} expert={expert} />
            )
          })}
        </div>
      ) : (
        <div className="new-experts-main-container">
          <span>Empty</span>
        </div>
      )}
    </>
  )
}
