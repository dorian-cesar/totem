export function getPriceInt(price: string): number {
  const hadSymbol: boolean = price.search(/\$/) > -1
  let result: string = price

  if (hadSymbol) result = price.substr(1)
  result = result.split('.').join('')

  return Number.parseInt(result)
}

export function getMinorPrice(service: TService): string {
  const price2: string = service.tarifaSegundoPiso

  if (price2) {
    const price1: string = service.tarifaPrimerPiso
    return getPriceInt(price1) < getPriceInt(price2) ? price1 : price2
  } else return service.tarifaPrimerPiso
}

// TODO: crear mejor un pipe para este calculo
export function getPriceFormated(value: string | number): string {
  const price: number =
    typeof value === 'number' ? Number.parseInt(value.toString()) : getPriceInt(value)
  const priceFormated = '$' + price.toLocaleString('es')

  return priceFormated
}

export class PriceSeat<T> {
  constructor(
    private service: TService,
    private floor: number,
    private out: 'number' | 'string' = 'string'
  ) {}

  public get(tarifaType: 'normal' | 'internet'): T {
    const floor = `${this.floor === 1 ? 'Primer' : 'Segundo'}Piso`
    const type = `${tarifaType === 'normal' ? '' : 'Internet'}`
    const price = this.service[`tarifa${floor + type}`]

    return this.out === 'number' ? getPriceInt(price) : price.split('.').join('')
  }
}
