import { useSelector } from 'react-redux'
import { ManageUsersFilter } from '../ManageUsersFilter/ManageUsersFilter'
import { ManageUsersTable } from '../../../sections/manage-users/ManageUsersTable/ManageUsersTable'
import { ManageUsersDeleteUserModal } from '../ManageUsersDeleteUserModal/ManageUsersDeleteUserModal'

import { Navbar } from '../../../../shared/Navbar/Navbar'

import { BiError } from 'react-icons/bi'

import ManageUsersCSS from './ManageUsers.css'

export const ManageUsers = () => {
  let { dbUsers, dbUser, isFailed, isLoading } = useSelector(
    (store) => store.admin
  )

  return (
    <div className="main-manage-users-container">
      <Navbar />
      <ManageUsersDeleteUserModal dbUser={dbUser} />

      <div className="manage-users-header">
        <h2 className="manage-users-header-title">Upravljajte korisnicima</h2>
        <h3 className="manage-users-header-subtitle">Filtriraj: </h3>
      </div>

      <ManageUsersFilter />
      <ManageUsersTable />

      {isFailed === true && isLoading === false && (
        <div className="manage-users-error-container">
          <BiError className="manage-users-error-no-data-icon" />
          <div className="manage-users-error-information">
            <p>
              Korisnici nisu uspješno dobavljeni! Ukoliko se ovaj problem
              nastavi, kontaktirajte podršku!
            </p>
          </div>
        </div>
      )}

      {!isFailed && isLoading === false && dbUsers?.length === 0 && (
        <div className="manage-users-users-list-main-container">
          <p className="manage-users-users-list-info">
            Korisnici tog opisa nisu registrovani na aplikaciju. Probajte novu
            pretragu
          </p>
        </div>
      )}
    </div>
  )
}
