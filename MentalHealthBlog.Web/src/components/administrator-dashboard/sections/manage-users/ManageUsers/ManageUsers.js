import { useSelector } from 'react-redux'
import { ManageUsersFilter } from '../ManageUsersFilter/ManageUsersFilter'
import { ManageUsersTable } from '../../../sections/manage-users/ManageUsersTable/ManageUsersTable'
import { ManageUsersDeleteUserModal } from '../ManageUsersDeleteUserModal/ManageUsersDeleteUserModal'

import { Navbar } from '../../../../shared/Navbar/Navbar'

import { BiError } from 'react-icons/bi'

import ManageUsersCSS from './ManageUsers.css'

export const ManageUsers = () => {
  let { dbUsers, dbUser, isFailed } = useSelector((store) => store.admin)

  return (
    <div className="main-manage-users-container">
      <Navbar />
      <ManageUsersDeleteUserModal dbUser={dbUser} />

      <div className="manage-users-header">
        <h2 className="manage-users-header-title">Manage users</h2>
        <h3 className="manage-users-header-subtitle">Filter: </h3>
      </div>

      <ManageUsersFilter />
      <ManageUsersTable />

      {isFailed && (
        <div className="manage-users-error-container">
          <BiError className="manage-users-error-no-data-icon" />
          <div className="manage-users-error-information">
            <p>
              Users not fetched properly! If this continues contact support!
            </p>
          </div>
        </div>
      )}

      {!isFailed && dbUsers?.length === 0 && (
        <div className="manage-users-users-list-main-container">
          <p className="manage-users-users-list-info">
            When someone register you'll see it first! ;)
          </p>
        </div>
      )}
    </div>
  )
}
