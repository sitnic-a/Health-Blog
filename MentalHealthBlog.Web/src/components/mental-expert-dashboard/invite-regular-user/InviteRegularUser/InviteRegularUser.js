import { Navbar } from '../../../shared/Navbar/Navbar'

import InviteRegularUserCSS from './InviteRegularUser.css'

export const InviteRegularUser = () => {
  return (
    <section id="invite-regular-user-main-container">
      <Navbar />

      <div className="invite-regular-user-container">
        <div className="invite-regular-user-header">
          <h1 className="invite-regular-user-header-title">
            Pozivnica za terapijski proces
          </h1>
          <p className="invite-regular-user-header-subtitle">
            Na ovoj sekciji aplikacije imate mogućnost da kao psiholog pozovete
            u terapijski proces nekoga ko je već registrovan ili da se osoba
            registruje na aplikaciju te se automatski poveže sa Vama.
          </p>
          <p className="invite-regular-user-header-subtitle">
            Potrebno je samo da unesete email osobe u polje ispod i da joj
            klikom na dugme "Pošalji" pošaljete poziv. Sve ostalo će aplikacija
            uraditi za Vas! Kada korisnik napravi profil ili klikne link sa svom
            emailu, dobiti ćete obavijest na Vaš email da ste se uspješno
            povezali
          </p>
        </div>

        <div className="invite-regular-user-call-container">
          <div className="invite-regular-user-call-email-container">
            <p className="invite-regular-user-call-email-title">Email adresa</p>
            <input
              className="invite-regular-user-call-email-value form-field"
              type="text"
              placeholder="Unesite email adresu..."
            />
          </div>
          {/* Invite validation data below */}

          <div className="invite-regular-user-call-actions-container">
            <button
              className="invite-regular-user-action invite-regular-user-invite-action"
              type="button"
              onClick={() => {
                alert('Sending invitation')
              }}
            >
              Pošalji
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
