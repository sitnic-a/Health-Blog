import { useDispatch, useSelector } from 'react-redux'
import * as signalR from '@microsoft/signalr'
import { getNewRegisteredExperts } from '../../../redux-toolkit/features/adminSlice'
import { application } from '../../../../application'
import { RequestNewExperts } from './RequestNewExperts'
import { toast } from 'react-toastify'

export const Requests = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)

  var connection = new signalR.HubConnectionBuilder()
    .withUrl(`${application.application_url}/rt-new-request`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .build()

  connection.on('GetNewRegisteredMentalHealthExperts', () => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getNewRegisteredExperts(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode
      if (statusCode !== 200) {
        if (statusCode === 404) {
          toast.error('Users not fetched properly!', {
            position: 'bottom-right',
          })
          return
        }
      }

      if (data?.payload?.statusCode === 200) {
        toast.success('Succesfully fetched requests!', {
          autoClose: 1500,
          position: 'bottom-right',
        })
      }
    })
  })

  connection.start().catch((e) => {
    console.log('Fetched error ', e)
  })

  return (
    <div className="requests-main-container">
      <RequestNewExperts />
    </div>
  )
}
