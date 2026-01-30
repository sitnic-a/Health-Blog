import { TailSpin } from 'react-loader-spinner'
import LoadingSpinnerCSS from './LoadingSpinner.css'

export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <span className="loading-spinner-text">Učitavanje stručnjaka </span>
      <TailSpin width={20} height={20} />
    </div>
  )
}
