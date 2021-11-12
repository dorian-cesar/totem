import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { getPriceInt } from '@HELPERS/price.helper'

@Injectable({
  providedIn: 'root'
})
export class TravelsService {
  constructor(public http: HttpClient) {}

  public async getOriginList(): Promise<TOrigin[] | null> {
    const endpoint = '/srv-centinela-web/rest/venta/buscarOrigen'

    try {
      const data = await this.http.get<TOrigin[]>(endpoint).toPromise()

      if (data) return data
      else return null
    } catch (error) {
      console.error('ERROR-GET-ORIGINS', error.message)
      return null
    }
  }

  public async getDestinyList(code: string): Promise<TDestiny[] | null> {
    const endpoint = `/srv-centinela-web/rest/venta/buscarDestino?codigo=${code}`

    try {
      const data = await this.http.get<TDestiny[]>(endpoint).toPromise()

      if (data) return data
      else return null
    } catch (error) {
      console.error('ERROR-GET-DESTINY', error.message)
      return null
    }
  }

  public async getServices(body: TBody['searchServices']): Promise<TService[] | null> {
    const endpoint = '/srv-centinela-web/rest/venta/buscarServicios'

    const bodyOverwrite: TBody['searchServices'] = { ...body, hora: '0000' }

    try {
      const data = await this.http
        .post<TService[]>(endpoint, JSON.stringify(bodyOverwrite))
        .toPromise()

      if (data) return data
      else return null
    } catch (error) {
      console.error('ERROR-GET-SERVICES', error.message)
      return null
    }
  }

  public async getVerticalTemplate(
    body: TBody['templateVertical']
  ): Promise<TVerticalTemplate | null> {
    const endpoint = '/integrador-web/rest/private/venta/buscarPlantillaVertical'

    try {
      const data = await this.http
        .post<TVerticalTemplate>(endpoint, JSON.stringify(body))
        .toPromise()

      if (data) return data
      else return null
    } catch (error) {
      console.error('ERROR-GET-SEATS', error.message)
      return null
    }
  }

  public async takeSeat(body: TBody['takeSeat']): Promise<TResponse['takeSeat'] | null> {
    const endpoint = '/srv-centinela-web/rest/venta/tomarAsiento'

    try {
      const data = await this.http.post<any>(endpoint, JSON.stringify(body)).toPromise()

      if (data) return data
      else return null
    } catch (error) {
      console.error('ERROR-TAKE-SEAT ->', error.message)
      return null
    }
  }

  public async liberateSeat(
    body: TBody['liberateSeat']
  ): Promise<TResponse['liberateSeat'] | null> {
    const endpoint = '/integrador-web/rest/private/venta/liberarAsiento'

    try {
      const data = this.http.post<any>(endpoint, JSON.stringify(body)).toPromise()

      if (data) return data
      else return null
    } catch (error) {
      console.error('ERROR-LIBERATE-SEAT ->', error.message)
      return null
    }
  }

  public async validateAgreement(
    body: TBody['agreement']
  ): Promise<TResponse['agreement'] | null> {
    const endpoint = '/administracion-web/rest/private/convenio/getDescuentoConvenio'

    try {
      const data = await this.http
        .post<TResponse['agreement']>(endpoint, JSON.stringify(body))
        .toPromise()

      if (data) {
        // Si no se aplica el convenio entonces se devuelven los montos a pagar de los asientos
        if (data.mensaje !== 'OK') {
          let total = 0

          body.listaBoleto.forEach((seat: TBodyTicket) => {
            total += getPriceInt(seat.pago)
          })

          data.montoTotal = total.toString()
          data.descuento = '0'
          data.totalApagar = total.toString()
        }

        return data
      } else return null
    } catch (error) {
      console.error('ERROR-VALIDATE-AGREEMEAT ->', error.message)
      return null
    }
  }

  public async saveTransaction(
    body: TBody['saveTrans']
  ): Promise<TResponse['saveTrans'] | null> {
    const endpoint = '/integrador-web/rest/pago/guardarTransaccion'

    try {
      const data = await this.http
        .post<TResponse['saveTrans']>(endpoint, JSON.stringify(body))
        .toPromise()

      if (data) return data
      else return null
    } catch (error) {
      console.error('ERROR-SAVE-TRANSACTION ->', error.message)
      return null
    }
  }

  public async generateTicket(
    body: TBody['finalizeTrans']
  ): Promise<TResponse['finalizeTrans'] | null> {
    const endpoint = '/integrador-web/rest/pago/terminarTransaccionPOS'

    try {
      const data = await this.http
        .post<TResponse['finalizeTrans']>(endpoint, JSON.stringify(body))
        .toPromise()

      if (data) return data
      else return null
    } catch (error) {
      console.error('ERROR-SAVE-TRANSACTION ->', error.message)
      return null
    }
  }
}
