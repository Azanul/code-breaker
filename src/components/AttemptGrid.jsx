const FEEDBACK_ICONS = {
  absent: '\u2717',
  present: '\u25CB',
  correct: '\u25CF',
}

const FEEDBACK_LABELS = {
  absent: 'ABSENT',
  present: 'PRESENT',
  correct: 'CORRECT',
}

export function AttemptGrid({ guesses, playerName }) {
  if (!guesses || guesses.length === 0) {
    return (
      <div className="attempt-grid">
        <h3 className="grid-title">{'>> ATTEMPTS'}</h3>
        <p className="empty-msg">NO GUESSES YET</p>
      </div>
    )
  }

  return (
    <div className="attempt-grid">
      <h3 className="grid-title">{'>> ATTEMPTS'}</h3>
      <div className="grid-rows">
        {guesses.map((g, i) => {
          const digits = g.guess.split('')
          const feedback = g.feedback || []

          return (
            <div className="grid-row" key={i}>
              <span className="row-number">#{i + 1}</span>
              <div className="row-digits">
                {digits.map((d, di) => (
                  <span key={di} className="digit-cell">{d}</span>
                ))}
              </div>
              <div className="row-feedback">
                {feedback.length > 0 ? feedback.map((f, fi) => (
                  <span
                    key={fi}
                    className={`feedback-cell feedback-${f}`}
                    title={FEEDBACK_LABELS[f]}
                  >
                    {FEEDBACK_ICONS[f]}
                  </span>
                )) : (
                  <span className="feedback-pending">{'\u25A1'}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
