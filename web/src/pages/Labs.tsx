import { useState, type FormEvent } from 'react'
import { Button, ButtonLink, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'
import type { LabResult } from '../types'

export function Labs() {
  const { labs, addLab } = useVita()
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('')
  const [range, setRange] = useState('')

  function save(event: FormEvent) {
    event.preventDefault()
    if (!name.trim() || !value.trim()) return
    const numeric = Number.parseFloat(value)
    const high = Number.parseFloat(range.replace(/[^\d.]/g, ''))
    const flagged = Number.isFinite(numeric) && Number.isFinite(high) && numeric > high
    const lab: Omit<LabResult, 'id'> = {
      name: name.trim(),
      value: value.trim(),
      unit: unit.trim(),
      range: range.trim() || 'Use the range printed on your report',
      flagged,
      note: flagged
        ? 'Outside the report range. Ask a clinician to review.'
        : 'Within the range you entered.',
    }
    addLab(lab)
    setName('')
    setValue('')
    setUnit('')
    setRange('')
  }

  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl font-bold">Lab results</h1>
      <p className="text-sm font-medium text-white/90">
        Use the range on your report. Out of range is flagged for clinic review.
      </p>
      <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)] lg:items-start">
      <form onSubmit={save}>
        <Card className="grid gap-3">
          <Field id="lab-name" label="Test name">
            <input
              id="lab-name"
              className={inputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="HbA1c"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id="lab-value" label="Value">
              <input
                id="lab-value"
                className={inputClass}
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            </Field>
            <Field id="lab-unit" label="Unit">
              <input
                id="lab-unit"
                className={inputClass}
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
              />
            </Field>
          </div>
          <Field id="lab-range" label="Range on your report">
            <input
              id="lab-range"
              className={inputClass}
              value={range}
              onChange={(event) => setRange(event.target.value)}
              placeholder="Below 7.0"
            />
          </Field>
          <Button type="submit">Save result</Button>
        </Card>
      </form>
      <div className="grid gap-4">
      {labs.map((lab) => (
        <Card key={lab.id} className={lab.flagged ? 'ring-burgundy/40' : ''}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold">{lab.name}</h2>
              <p className="text-sm text-muted">
                {lab.value} {lab.unit} · report range {lab.range}
              </p>
            </div>
            {lab.flagged ? (
              <span className="rounded-full bg-burgundy/10 px-2.5 py-1 text-xs font-semibold text-burgundy">
                Out of range
              </span>
            ) : (
              <span className="rounded-full bg-navy/10 px-2.5 py-1 text-xs font-semibold text-navy">
                In range
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-muted">{lab.note}</p>
          {lab.flagged ? (
            <ButtonLink to="/app/labs/follow-up" className="mt-4">
              Book follow-up
            </ButtonLink>
          ) : null}
        </Card>
      ))}
      </div>
      </div>
    </div>
  )
}
