import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { AuthService } from '@SERVICES/auth.service'
import { TravelsService } from '@SERVICES/travels/travels.service'
import { PriceSeat, getPriceFormated } from '@HELPERS/price.helper'
import { getDateWithoutFormat } from '@HELPERS/time.helper'
import { AlertService } from '@SERVICES/alert/alert.service'

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  @Input() public travel: TTravel
  @Input() public service: TService
  @Input() public seats: TTakedSeat[]
  @Input() public confirmationList: TConfirmation[]

  @Output() public eventSwapTravel: EventEmitter<null> = new EventEmitter()
  @Output() public eventConfirmation: EventEmitter<TConfirmation> = new EventEmitter()

  public ticketViewList: TTicketView[]
  public ticketView: TTicketView
  public total: TTotal = null
  public floor: number
  private user: TUser
  private priceSeat: PriceSeat<string>

  constructor(
    private travelsService: TravelsService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.user = this.authService.user()
    this.floor = this.seats[0].floor
    this.priceSeat = new PriceSeat(this.service, this.floor)

    this.loadTicketViewList()
    this.validateAgreement()
  }

  private loadTicketViewList(): void {
    // Se recupera las vistas de boletos anteriores
    this.ticketViewList = this.confirmationList.map(confirm => confirm.view)

    // Se crea la nueva vista de boleto
    this.ticketView = {
      items: [
        {
          title: 'Origen',
          description: this.travel.origen.nombre
        },
        {
          title: 'Fecha de salida',
          description: this.service.fechaSalida
        },
        {
          title: 'Hora de salida',
          description: this.service.horaSalida
        },
        {
          title: 'N° de asiento',
          description: this.seats[0].nro
        },
        {
          title: 'Tipo de asientos',
          description:
            this.floor === 1
              ? this.service.servicioPrimerPiso
              : this.service.servicioSegundoPiso
        },
        {
          title: 'Destino',
          description: this.travel.destino.nombre
        },
        {
          title: 'Hora de llegada',
          description: this.service.horaLlegada
        }
      ],
      subtotal: getPriceFormated(this.priceSeat.get('normal'))
    }

    this.ticketViewList.push(this.ticketView)
  }

  private async validateAgreement(): Promise<void> {
    const listaBoleto = this.createTicketBodyList()

    const body: TBody['agreement'] = {
      idConvenio: 'CMCEN',
      listaAtributo: [{ idCampo: 'RUT', valor: this.user.rut }],
      listaBoleto,
      mensaje: '',
      montoTotal: '0',
      descuento: '0',
      totalApagar: '0'
    }

    try {
      const resp = await this.travelsService.validateAgreement(body)

      switch (resp.mensaje) {
        case 'NO EXISTE EL CONVENIO CMCEN':
          this.alertService.open('El usuario no recibe descuento para este servicio')
          break
      }

      this.total = {
        subtotal: getPriceFormated(resp.montoTotal),
        discount: getPriceFormated(resp.descuento),
        total: getPriceFormated(resp.totalApagar)
      }

      this.eventConfirmation.emit({
        view: this.ticketView,
        bodyList: listaBoleto.pop(),
        total: this.total
      })
    } catch (error) {
      console.error('ERROR-VALIDATE ->', error)
      alert('Error al validar convenio')
    }
  }

  private createTicketBodyList(): TBodyTicket[] {
    const ticketBodyList: TBodyTicket[] = this.confirmationList.map(
      confirm => confirm.bodyList
    )

    this.seats.forEach((seat: TTakedSeat) => {
      const ticketBody: TBodyTicket = {
        clase:
          this.floor === 1
            ? this.service.idClaseBusPisoUno
            : this.service.idClaseBusPisoDos,
        descuento: '',
        destino: this.service.idTerminalDestino,
        fechaSalida: getDateWithoutFormat(this.service.fechaSalida),
        idServicio: this.service.idServicio,
        origen: this.service.idTerminalOrigen,
        pago: this.priceSeat.get('internet'),
        piso: this.floor === 1 ? 0 : 1,
        valor: this.priceSeat.get('normal'),
        asiento: seat.nro,
        promocion: '0',
        bus: this.floor === 1 ? this.service.busPiso1 : this.service.busPiso2,
        horaSalida: this.service.horaSalida.split(':').join(''),
        rut: this.user.rut
      }

      ticketBodyList.push(ticketBody)
    })

    return ticketBodyList
  }
}
