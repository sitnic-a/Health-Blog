import useFetchLocationState from '../../../custom/hooks/useFetchLocationState'
import { application } from '../../../../application'

import * as signalR from '@microsoft/signalr'
import { useDispatch } from 'react-redux'
import { getNewRegisteredExperts } from '../../../redux-toolkit/features/adminSlice'

import { NewMentalHealthExpertProfile } from './NewMentalHealthExpertProfile'
export const NewExperts = () => {
  let dispatch = useDispatch()

  let { newlyRegisteredMentalHealthExperts } = useFetchLocationState()
  console.log(newlyRegisteredMentalHealthExperts)

  var connection = new signalR.HubConnectionBuilder()
    .withUrl(`${application.application_url}/rt-new-request`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .build()

  connection.on('GetNewRegisteredMentalHealthExperts', (data) => {
    console.log('RT- Data ', data)
    dispatch(getNewRegisteredExperts())
  })

  connection.start().catch((e) => {
    console.log('Fetched error ', e)
  })

  return (
    newlyRegisteredMentalHealthExperts && (
      <div className="new-experts-main-container">
        {newlyRegisteredMentalHealthExperts.map((expert) => {
          return (
            <NewMentalHealthExpertProfile key={expert.id} expert={expert} />
          )
        })}
        {/* Service, controller for printing not approved experts */}
        {/* Real-time update of new registered experts - SignalR */}
        {/* Display all not approved experts with two actions - approve and reject */}
        {/* Admin slice for cleaner code and better manipulation */}
        {/* Create component to print mental health expert */}
      </div>
    )
  )
}
