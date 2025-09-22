import LoaderCSS from './Loader.css'

export const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-box-room">
        <div className="loader-box"></div>
        <div className="loading-text-container">
          <p className="loading-text">Učitavanje...</p>
        </div>
      </div>
    </div>
  )
}
