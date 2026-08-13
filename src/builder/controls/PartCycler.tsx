export interface PartCyclerProps {
  label: string
  value: string
  index: number
  total: number
  swatch?: string
  onPrevious: () => void
  onNext: () => void
  classNames?: { row?: string; button?: string; value?: string }
}

export const PartCycler = ({
  label,
  value,
  index,
  total,
  swatch,
  onPrevious,
  onNext,
  classNames,
}: PartCyclerProps) => (
  <div className={`pcb-row ${classNames?.row ?? ''}`}>
    <span className="pcb-row-label">{label}</span>
    <div className="pcb-row-control">
      <button
        type="button"
        className={`pcb-step ${classNames?.button ?? ''}`}
        onClick={onPrevious}
        aria-label={`Previous ${label}`}
      >
        ‹
      </button>
      <span className={`pcb-value ${classNames?.value ?? ''}`}>
        <span className="pcb-value-name">{value}</span>
        <span className="pcb-value-meta">
          {swatch ? <span className="pcb-swatch" style={{ background: swatch }} /> : null}
          <span className="pcb-counter">
            {index}/{total}
          </span>
        </span>
      </span>
      <button
        type="button"
        className={`pcb-step ${classNames?.button ?? ''}`}
        onClick={onNext}
        aria-label={`Next ${label}`}
      >
        ›
      </button>
    </div>
  </div>
)
