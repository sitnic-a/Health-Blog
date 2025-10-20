import { useParams } from 'react-router-dom'
import { Navbar } from './shared/Navbar/Navbar'

export const Assignments = () => {
  let { id } = useParams()

  return (
    <section id="user-assignments-main-container">
      <Navbar />

      <div className="user-assignments-assignments-from-main-container">
        <div className="user-assignments-assignments-from-container">
          {/*List of doctor that gave an assignment */}
        </div>
      </div>
    </section>
  )
}
