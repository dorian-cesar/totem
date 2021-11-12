import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { TravelsService } from '@SERVICES/travels/travels.service'
import { getMinorPrice } from '@HELPERS/price.helper'

@Component({
  selector: 'app-choose-services',
  templateUrl: './choose-services.component.html',
  styleUrls: ['./choose-services.component.scss']
})
export class ChooseServicesComponent implements OnInit, OnChanges {
  @Input() travel: TTravel
  @Input() travelType: TTravelType
  @Output() eventService: EventEmitter<TService> = new EventEmitter()

  public services: TService[] = []
  public loading: boolean

  constructor(private travelsService: TravelsService) {}

  ngOnInit() {}

  ngOnChanges() {
    this.getServices()
  }

  public selectService(service: TService): void {
    this.eventService.emit(service)
  }

  private async getServices(): Promise<void> {
    this.services = []
    this.loading = true

    const fecha = this.travelType === 'ida' ? this.travel.ida : this.travel.vuelta

    const body: TBody['searchServices'] = {
      origen: this.travel.origen.codigo,
      destino: this.travel.destino.codigo,
      fecha: fecha.split('-').join('')
    }

    try {
      this.services = await this.travelsService.getServices(body)
    } catch (error) {
      console.error('ERROR-GET-SERVICES ->', error)
      alert('Error al obtener la lista de rutas disponibles, intentelo de nuevo')
    } finally {
      this.loading = false
    }
  }

  public minorPriceSeat(service: TService): string {
    return getMinorPrice(service)
  }
}
