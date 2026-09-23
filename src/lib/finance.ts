import type { LoanOffer, SectorBancario } from '../data/loans'

/** Cuota mensual fija por sistema francés de amortización. */
export function cuotaFrancesa(monto: number, tnaPct: number, plazoMeses: number): number {
  const i = tnaPct / 100 / 12
  if (i === 0) return monto / plazoMeses
  const factor = Math.pow(1 + i, plazoMeses)
  return (monto * i * factor) / (factor - 1)
}

export interface OfertaCalculada extends LoanOffer {
  cuotaMensual: number
  costoTotal: number
  interesTotal: number
  dentroDeRango: boolean
}

export function calcularOferta(oferta: LoanOffer, monto: number, plazoMeses: number): OfertaCalculada {
  const cuotaMensual = cuotaFrancesa(monto, oferta.tna, plazoMeses)
  const costoTotal = cuotaMensual * plazoMeses
  const dentroDeRango =
    monto >= oferta.montoMin &&
    monto <= oferta.montoMax &&
    plazoMeses >= oferta.plazoMinMeses &&
    plazoMeses <= oferta.plazoMaxMeses

  return {
    ...oferta,
    cuotaMensual,
    costoTotal,
    interesTotal: costoTotal - monto,
    dentroDeRango,
  }
}

/** Ordena de más a menos conveniente según CFT (menor CFT = más conveniente). */
export function rankearPorCFT(ofertas: OfertaCalculada[]): OfertaCalculada[] {
  return [...ofertas].sort((a, b) => a.cft - b.cft)
}

export interface ResumenSector {
  sector: SectorBancario
  ofertas: OfertaCalculada[]
  cantidadBancos: number
  cftPromedio: number
  tnaPromedio: number
  mejorOferta: OfertaCalculada
}

/** Agrupa las ofertas por sector bancario y calcula sus estadísticas de conveniencia. */
export function agruparPorSector(ofertas: OfertaCalculada[]): ResumenSector[] {
  const sectores = new Map<SectorBancario, OfertaCalculada[]>()
  for (const oferta of ofertas) {
    const lista = sectores.get(oferta.sector) ?? []
    lista.push(oferta)
    sectores.set(oferta.sector, lista)
  }

  const resumenes: ResumenSector[] = []
  for (const [sector, lista] of sectores) {
    const ordenadas = [...lista].sort((a, b) => a.cft - b.cft)
    resumenes.push({
      sector,
      ofertas: ordenadas,
      cantidadBancos: ordenadas.length,
      cftPromedio: ordenadas.reduce((s, o) => s + o.cft, 0) / ordenadas.length,
      tnaPromedio: ordenadas.reduce((s, o) => s + o.tna, 0) / ordenadas.length,
      mejorOferta: ordenadas[0],
    })
  }

  return resumenes.sort((a, b) => a.mejorOferta.cft - b.mejorOferta.cft)
}

export function formatoMoneda(valor: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor)
}

export function formatoPorcentaje(valor: number): string {
  return `${valor.toLocaleString('es-AR', { maximumFractionDigits: 2 })}%`
}
