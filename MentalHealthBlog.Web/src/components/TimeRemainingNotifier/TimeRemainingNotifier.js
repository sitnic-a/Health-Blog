import TimeRemainingNotifierCSS from './TimeRemainingNotifier.css'

export const TimeRemainingNotifier = () => {
  return (
    <div id="timer-container" className="timer-container-hidden">
      <p className="timer-title">
        Vaša trenutna pretplata ističe za
        <span className="timer-seconds"> </span> sekundi! Nakon isteka, Vaš
        profil se automatski zaključava do sljedeće uplate!
      </p>
    </div>
  )
}
