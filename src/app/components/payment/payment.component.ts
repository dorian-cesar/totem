import { Component, OnInit, Input } from '@angular/core'
import { AuthService } from '@SERVICES/auth.service'
import { TravelsService } from '@SERVICES/travels/travels.service'
import { PriceSeat } from '@HELPERS/price.helper'
import { getCurrentDateOfPay } from '@HELPERS/time.helper'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() ticket: TTicket

  private user: TUser
  public step = 1
  public transactions = []

  constructor(private travelsService: TravelsService, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.user()
  }

  // TODO: metodo temporal para probar los metodos para pagar en pullman
  public async nextStep(): Promise<void> {
    if (this.step < 3) this.step++

    if (this.step === 3) {
      try {
        const code = await this.createTransaction()
        await this.finalizeTransaction(code)
      } catch (error) {
        console.error('ERROR ->', error)
      }
    }
  }

  public async createTransaction(): Promise<string> {
    let listaCarrito: TBodyCart[] = []

    this.ticket.list.map(({ seats, service }) => {
      return seats.map(seat => {
        const floor: number = seat.floor
        const priceSeat = new PriceSeat<number>(service, floor, 'number')

        const cart = {
          asiento: seat.nro,
          clase: floor === 1 ? service.idClaseBusPisoUno : service.idClaseBusPisoDos,
          servicio: service.idServicio,
          fechaServicio: service.fechaServicio,
          fechaPasada: service.fechaSalida,
          horaSalida: service.horaSalida,
          origen: service.idTerminalOrigen,
          destino: service.idTerminalDestino,
          monto: priceSeat.get('normal'),
          precio: priceSeat.get('internet'),
          empresa: service.empresa,
          bus: floor === 1 ? service.busPiso1 : service.busPiso2,
          piso: floor.toString(),
          integrador: service.integrador
        }

        listaCarrito.push(cart)
      })
    })

    const body: TBody['saveTrans'] = {
      email: this.user.email,
      rut: this.user.rut,
      medioDePago: 'POS',
      puntoVenta: 'POS01', // TODO: esta info debe venir del POS
      montoTotal: this.ticket.total,
      idSistema: 4, // Este valor es estatico
      listaCarrito
    }

    const response = await this.travelsService.saveTransaction(body)
    if (response.exito) return response.codigo
    else {
      console.log('RESULT-CREATE-TRANSACTION ->', response.mensaje)
    }
  }

  public async finalizeTransaction(orden: string): Promise<void> {
    const body: TBody['finalizeTrans'] = {
      orden,
      codigoTransaccion: '240312', // TODO: este dato debe venir del POS
      numeroCuota: '0',
      numeroTarjeta: '9480', // TODO: este dato debe venir del POS
      tipoPago: 'MC',
      fechaCompra: getCurrentDateOfPay(),
      codigoRespuesta: 0
    }

    const response = await this.travelsService.generateTicket(body)

    if (response.estado && response.mensaje === 'Boletos generados con exito') {
      this.transactions = response.boletos.map(boleto => JSON.parse(boleto))
      console.log(this.transactions)
    } else {
      console.log('RESULT-FINALIZE-TRANSACTION ->', response.error)
    }
  }
}
