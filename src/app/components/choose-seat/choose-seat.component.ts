import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core'

import { TravelsService } from '@SERVICES/travels/travels.service'
import { AuthService } from '@SERVICES/auth.service'
import { AlertService } from '@SERVICES/alert/alert.service'

import { SeatState, SeatCache } from '@HELPERS/seats.helper'
import { getMinorPrice } from '@HELPERS/price.helper'

@Component({
  selector: 'app-choose-seat',
  templateUrl: './choose-seat.component.html',
  styleUrls: ['./choose-seat.component.scss']
})
export class ChooseSeatComponent implements OnInit, OnChanges {
  @Input() public service: TService = null
  @Output() private eventSeats: EventEmitter<TTakedSeat[]> = new EventEmitter()

  public floors: TFloors = []
  public loadingSeat = false
  private user: TUser = null
  private seatCache: SeatCache
  private selectedSeat: TSeatExtend = null

  constructor(
    private travelsService: TravelsService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.user = this.authService.user()
    this.seatCache = new SeatCache(this.service)
  }

  ngOnChanges(changes) {
    if (changes.service.currentValue) this.loadSeats()
  }

  private async loadSeats(): Promise<void> {
    const body: TBody['templateVertical'] = {
      idServicio: this.service.idServicio,
      tipoBusPiso1: this.service.busPiso1,
      tipoBusPiso2: this.service.busPiso2 || '',
      fechaServicio: this.service.fechaSalida,
      idOrigen: this.service.idTerminalOrigen,
      idDestino: this.service.idTerminalDestino,
      integrador: this.service.integrador,
      clasePiso1: this.service.idClaseBusPisoUno,
      clasePiso2: this.service.idClaseBusPisoDos || ''
    }
    const verticalTemplate = await this.travelsService.getVerticalTemplate(body)

    if (verticalTemplate) {
      this.floors = []
      const takedSeats = this.seatCache.getAll()

      for (const floorNro in verticalTemplate) {
        const seatsCol = verticalTemplate[floorNro]

        const seatsReverse: TSeatsCol = seatsCol.map((seatsRow: TSeatsRow) => {
          const seatsRowOverwrite = seatsRow.map((seat: TSeat) => {
            const takeSeat = takedSeats.find(takedSeat => {
              if (
                takedSeat.idService === this.service.idServicio &&
                takedSeat.nro === seat.asiento
              ) {
                return true
              }
            })

            return <TSeatExtend>{
              ...seat,
              estado: takeSeat ? 'tomado' : seat.estado,
              floor: Number(floorNro)
            }
          })

          // Invertir el orden de las columnas de cada fila de asientos
          return seatsRowOverwrite.reverse()
        })

        this.floors.push(seatsReverse)
      }
    } else alert('No se pudo obtener los asientos')
  }

  public getIconSeat(state: TState): string {
    switch (state) {
      case 'ocupado':
        return 'assets/icon/seat-occupied.png'

      case 'tomado':
        return 'assets/icon/seat-taked.png'

      default:
        return 'assets/icon/seat-free.png'
    }
  }

  public async takeLiberateSeat(
    seatsCol: TSeatsCol,
    selectedSeat: TSeatExtend,
    floorNro: number
  ): Promise<void> {
    const seats = this.seatCache.getAll()
    const seatState = new SeatState(seatsCol, selectedSeat)
    const selectedSeatState = selectedSeat.estado as TState

    try {
      this.floors[floorNro] = seatState.update('loading')
      this.loadingSeat = true

      const body: TBodySeat = {
        servicio: this.service.idServicio,
        fecha: this.service.fechaServicio,
        origen: this.service.idTerminalOrigen,
        destino: this.service.idTerminalDestino,
        asiento: selectedSeat.asiento
      }

      if (selectedSeatState === 'libre') {
        if (seats.length) throw 'Cliente ya tiene un asiento seleccionado'

        this.selectedSeat = selectedSeat
        const bodyTakeSeat: TBody['takeSeat'] = {
          ...body,
          rut: this.user.rut
        }
        const response = await this.travelsService.takeSeat(bodyTakeSeat)

        if (response?.exito) {
          this.floors[floorNro] = seatState.update('tomado')
          this.seatCache.save(selectedSeat)
        } else throw response.mensaje
      } else if (selectedSeatState === 'tomado') {
        this.selectedSeat = null
        const bodyLiberateSeat: TBody['liberateSeat'] = {
          ...body,
          integrador: this.service.integrador
        }
        const seatLiberated: number = await this.travelsService.liberateSeat(
          bodyLiberateSeat
        )

        if (seatLiberated) {
          this.floors[floorNro] = seatState.update('libre')
          this.seatCache.delete(selectedSeat.asiento)
        } else throw 'Error al liberar asiento'
      }
    } catch (error) {
      // Manejador de errores
      switch (error) {
        case 'Asiento ya se encuentra ocupado':
          await this.loadSeats()
          this.alertService.open(
            'Disculpe, este asiento ha sido reservado por otro usuario.'
          )
          break

        case 'Cliente ya tiene un asiento para este servicio':
          this.floors[floorNro] = seatState.update(selectedSeatState)
          this.alertService.open('No puede reservar mas de un asiento por servicio.')
          break

        case 'Cliente ya tiene un asiento seleccionado':
          this.floors[floorNro] = seatState.update(selectedSeatState)
          this.alertService.open('No puede tomar mas de un asiento.')
          break

        case 'Error al liberar asiento':
          this.alertService.open('Error al liberar el asiento, intentelo nuevamente')
          break

        default:
          this.alertService.open()
          console.error('ERROR-TAKE-LIBERATE-SEAT ->', error)
          break
      }
    } finally {
      this.loadingSeat = false
      this.eventSeats.emit(this.seatCache.getAll())
    }
  }

  public hasSeat(state: TState, discard?: TState): boolean {
    const states: TState[] = ['libre', 'tomado', 'ocupado']
    return states.includes(state) && state !== discard
  }

  public hasBath(seatNro: string): boolean {
    return seatNro === 'B1' || seatNro === 'B2'
  }

  public priceSelectedSeat(): string {
    if (this.selectedSeat) {
      return this.selectedSeat?.floor === 1
        ? this.service.tarifaPrimerPiso
        : this.service.tarifaSegundoPiso
    } else return getMinorPrice(this.service)
  }
}
