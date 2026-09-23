import { useState } from 'react'
import { SECTORES_BANCARIOS } from '../data/loans'
import type { OfertaCalculada, ResumenSector } from '../lib/finance'
import { formatoPorcentaje } from '../lib/finance'

interface Props {
  resumenes: ResumenSector[]
}

function TarjetaSector({ resumen }: { resumen: ResumenSector }) {
  const [abierto, setAbierto] = useState(false)
  const info = SECTORES_BANCARIOS.find((s) => s.key === resumen.sector)!

  return (
    <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
      <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--series-blue)' }}>
        {info.label}
      </p>
      <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
        {info.descripcion}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Bancos comparados
          </p>
          <p className="tabular text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {resumen.cantidadBancos}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Mejor CFT del sector
          </p>
          <p className="tabular text-lg font-semibold" style={{ color: 'var(--status-good-text)' }}>
            {formatoPorcentaje(resumen.mejorOferta.cft)}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            CFT promedio
          </p>
          <p className="tabular text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {formatoPorcentaje(resumen.cftPromedio)}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            TNA promedio
          </p>
          <p className="tabular text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {formatoPorcentaje(resumen.tnaPromedio)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
        Más conveniente del sector: <span className="font-semibold">{resumen.mejorOferta.banco}</span>
      </p>

      <button
        onClick={() => setAbierto(!abierto)}
        className="mt-3 text-xs font-medium hover:underline"
        style={{ color: 'var(--series-blue)' }}
      >
        {abierto ? '▾ Ocultar bancos del sector' : `▸ Ver los ${resumen.cantidadBancos} bancos del sector`}
      </button>

      {abierto && (
        <ul className="mt-3 space-y-1.5 border-t pt-3" style={{ borderColor: 'var(--gridline)' }}>
          {resumen.ofertas.map((o: OfertaCalculada) => (
            <li key={o.id} className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>{o.banco}</span>
              <span className="tabular font-medium" style={{ color: 'var(--text-primary)' }}>
                CFT {formatoPorcentaje(o.cft)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SectoresPanel({ resumenes }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Comparación agrupada por sector bancario, para el monto y plazo elegidos arriba. La clasificación de cada
        banco es orientativa, según el origen mayoritario de su capital.
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {resumenes.map((r) => (
          <TarjetaSector key={r.sector} resumen={r} />
        ))}
      </div>
    </div>
  )
}
