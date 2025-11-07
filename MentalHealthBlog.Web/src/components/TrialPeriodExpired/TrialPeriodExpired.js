import TrialPeriodExpiredCSS from './TrialPeriodExpired.css'

export const TrialPeriodExpired = () => {
  return (
    <section id="trial-period-expired-main-container">
      <div className="trial-period-expired-container">
        <div className="trial-period-expired-description-container">
          <h1 className="trial-period-expired-description-title">
            Vaša pretplata je istekla!
          </h1>
          <p className="trial-period-expired-description">
            Ukoliko želite nastaviti korištenje aplikacije, molimo Vas da
            uplatite dogovoreni iznos na broj žiro računa. Aplikacija će ubrzo
            nakon uplate biti ponovo dostupna i spremna za korištenje.
          </p>
        </div>

        <div className="trial-period-expired-provider-info">
          <p className="trial-period-expired-provider-info-value">
            Broj žiro računa:{' '}
            <span className="trial-period-expired-bank-account-info-value">
              000000000000000000
            </span>
          </p>
          <p className="trial-period-expired-provider-info-value">
            Kontakt email:{' '}
            <span className="trial-period-expired-contact-email-info-value">
              support@mapp-terapija.com
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
