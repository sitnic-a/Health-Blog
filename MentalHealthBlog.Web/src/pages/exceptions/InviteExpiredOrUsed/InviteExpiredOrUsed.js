import { TbClockExclamation } from 'react-icons/tb'

import InviteExpiredOrUsedCSS from './InviteExpiredOrUsed.css'

export const InviteExpiredOrUsed = () => {
  return (
    <section id="invitation-expired-or-used-main-container">
      <div className="invitation-expired-or-used-container">
        <div className="invitation-expired-or-used-content">
          <TbClockExclamation className="invitation-expired-or-used-icon" />
          <p className="invitation-expired-or-used-title">
            Pozivnica nije validna!
          </p>
          <p className="invitation-expired-or-used-description">
            Tražena pozivnica je istekla ili je već prethodno iskorištena.
          </p>
          <div className="invitation-expired-or-used-actions">
            <a
              href="https://mapp-terapija.com/"
              className="invitation-expired-or-used-go-to-app-button"
            >
              Idi na aplikaciju
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
