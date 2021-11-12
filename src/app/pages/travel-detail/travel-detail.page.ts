import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

import { TravelsService } from '@SERVICES/travels/travels.service'
import { SeatCache } from '@HELPERS/seats.helper'
import { getPriceInt } from '@HELPERS/price.helper'

@Component({
  selector: 'app-travel-detail',
  templateUrl: './travel-detail.page.html',
  styleUrls: ['./travel-detail.page.scss']
})
export class TravelDetailPage implements OnInit {
  private seatCache: SeatCache
  private viewNro = 0
  private views: TViews[] = ['travel', 'services', 'seats', 'confirmation', 'payment']
  public travelForm: FormGroup = null
  public currentView: TViews = 'travel'
  public continue = false

  // DATA
  public travelType: TTravelType = 'ida'
  public travel: TTravel = {
    origen: {
      nombre: '',
      codigo: ''
    },
    destino: {
      nombre: '',
      codigo: ''
    },
    ida: '',
    vuelta: ''
  }
  public service: TService = null
  public seats: TTakedSeat[] = []
  public confirmationList: TConfirmation[] = []
  public ticket: TTicket = { list: [], total: 0 }

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private travelsService: TravelsService
  ) {}

  ngOnInit() {
    this.seatCache = new SeatCache()
    this.initForm()
  }

  public logout(): void {
    localStorage.clear()
    this._router.navigate(['/'])
  }

  private initForm() {
    this.travelForm = this.fb.group(
      {
        ida: [''],
        vuelta: ['']
      },
      {
        validators: [Validators.required]
      }
    )
  }

  public formChange() {
    const { vuelta } = this.travelForm.getRawValue()

    if (vuelta) {
      this.travel = { ...this.travel, vuelta }
      this.travelForm.get('vuelta').setValue(vuelta)
    }
  }

  public saveTravel({ travel, type }: TSelectTravel): void {
    this.travel = travel
    this.travelType = type
    this.continue = true
  }

  public saveService(service: TService): void {
    this.service = service
    this.changeView('next')
  }

  public saveConfirmation(confirmation: TConfirmation): void {
    this.ticket.list.push({
      travel: this.travel,
      service: this.service,
      seats: this.seats
    })
    this.ticket.total = getPriceInt(confirmation.total.total)

    this.confirmationList.push(confirmation)
  }

  public changeView(route: 'back' | 'next' | TViews): void {
    const backView: TViews = this.views[this.viewNro]

    if (route === 'next') this.viewNro++
    else if (route === 'back') this.viewNro--
    else this.viewNro = this.views.findIndex(view => view === route)

    const newView = this.views[this.viewNro]

    /* Los asientos se reinician solo si se cumplen las siguientes condiciones:
      - Cuando se selecciona ATRAS desde la vista "seats"
      - Cuando se selecciona CONTINUAR desde la vista "services" y el tipo de viaje es "ida"
    */
    if (
      (backView === 'seats' && newView === 'services') ||
      (backView === 'services' && newView === 'seats' && this.travelType === 'ida')
    ) {
      this.seatsReset()
    }
    // Cuando se selecciona VUELTA desde la vista "confirmation"
    if (backView === 'confirmation' && newView === 'services') {
      this.seatCache.reset()
    }
    // Cuando se selecciona ATRAS desde la vista "confirmation"
    if (backView === 'confirmation' && newView === 'seats') {
      this.confirmationList.pop()
      this.ticket.list.pop()
      this.ticket.total = null
    }
    if (newView === 'travel') {
      this.continue = false
    }
    if (newView === 'services') {
      this.travelForm.get('ida').setValue(this.travel.ida)
    }

    this.currentView = newView
  }

  private async seatsReset(): Promise<void> {
    const takedSeats = this.seatCache.getAll()

    if (takedSeats.length) {
      const body: TBodySeat = {
        servicio: this.service.idServicio,
        fecha: this.service.fechaServicio,
        origen: this.service.idTerminalOrigen,
        destino: this.service.idTerminalDestino,
        asiento: ''
      }

      takedSeats.forEach(async takedSeat => {
        const bodyLiberateSeat: TBody['liberateSeat'] = {
          ...body,
          asiento: takedSeat.nro,
          integrador: this.service.integrador
        }

        const seatLiberated: number = await this.travelsService.liberateSeat(
          bodyLiberateSeat
        )

        if (seatLiberated) {
          this.seats = []
          this.seatCache.reset()
        } else {
          console.error('ERROR-SERVICES-RESET ->', seatLiberated)
          alert('Error al limpiar todos los asientos seleccionados')
        }
      })
    }
  }

  public swapTravel(): void {
    const { origen, destino } = this.travel

    this.travelType = this.travelType === 'ida' ? 'vuelta' : 'ida'
    if (this.currentView !== 'services') this.changeView('services')

    this.travel = {
      ...this.travel,
      origen: destino,
      destino: origen
    }
  }
}
