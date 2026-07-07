const STATE_LABELS = {
  unknown: '?',
  absent: '\u2717',
  present: '\u25CB',
  confirmed: '\u25CF',
}

const STATE_COLORS = {
  unknown: 'ledger-unknown',
  absent: 'ledger-absent',
  present: 'ledger-present',
  confirmed: 'ledger-confirmed',
}

const STATE_TITLES = {
  unknown: 'Unknown',
  absent: 'Not in code',
  present: 'Exists elsewhere',
  confirmed: 'Correct position',
}

export function DigitLedger({ ledger }) {
  return (
    <div className="digit-ledger">
      <h3 className="ledger-title">{'>> LEDGER'}</h3>
      <div className="ledger-list">
        {Array.from({ length: 10 }, (_, i) => {
          const state = ledger ? ledger[i] : 'unknown'
          return (
            <div key={i} className={`ledger-entry ${STATE_COLORS[state]}`} title={STATE_TITLES[state]}>
              <span className="ledger-digit">{i}</span>
              <span className="ledger-state">{STATE_LABELS[state]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
