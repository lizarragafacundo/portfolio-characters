export interface Chip {
  id: string
  label: string
  selected: boolean
  onSelect: () => void
}

export interface ChipRowProps {
  legend: string
  note?: string
  chips: Chip[]
  hint?: string
  classNames?: { panel?: string; chip?: string }
}

export const ChipRow = ({ legend, note, chips, hint, classNames }: ChipRowProps) => (
  <section className={`pcb-panel ${classNames?.panel ?? ''}`}>
    <h3 className="pcb-legend">
      {legend}
      {note ? <span className="pcb-legend-note">{note}</span> : null}
    </h3>
    <div className="pcb-chips">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          aria-pressed={chip.selected}
          className={`pcb-chip ${chip.selected ? 'pcb-chip-on' : ''} ${classNames?.chip ?? ''}`}
          onClick={chip.onSelect}
        >
          {chip.label}
        </button>
      ))}
    </div>
    {hint ? <p className="pcb-hint">{hint}</p> : null}
  </section>
)
