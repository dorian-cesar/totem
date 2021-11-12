import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { TravelsService } from '@SERVICES/travels/travels.service'

@Component({
  selector: 'app-choose-travel',
  templateUrl: './choose-travel.component.html',
  styleUrls: ['./choose-travel.component.scss']
})
export class ChooseTravelComponent implements OnInit {
  @Output() public eventTravel: EventEmitter<TSelectTravel> = new EventEmitter()

  public travelType: TTravelType = 'ida'
  public travelForm: FormGroup
  public originList: TOrigin[] = []
  public destinyList: TDestiny[] = []

  constructor(private fb: FormBuilder, private travelsService: TravelsService) {}

  ngOnInit() {
    this.initForm()
    this.searchOriginList()
  }

  private initForm(): void {
    this.travelForm = this.fb.group(
      {
        origen: [''],
        destino: [''],
        ida: [''],
        vuelta: ['']
      },
      {
        validators: [Validators.required]
      }
    )
  }

  public searchOriginList(): void {
    this.travelsService.getOriginList().then(originList => (this.originList = originList))
  }

  public searchDestinyList(event): void {
    const origin = event.detail.value

    this.travelsService
      .getDestinyList(origin.codigo)
      .then(destinyList => (this.destinyList = destinyList))
  }

  public formChange() {
    if (this.travelForm.status === 'VALID') {
      const travel = this.travelForm.getRawValue() as TTravel

      if (
        (this.travelType === 'ida' && travel.ida) ||
        (this.travelType === 'ida_vuelta' && travel.ida && travel.vuelta)
      ) {
        this.eventTravel.emit({
          travel,
          type: this.travelType
        })
      }
    }
  }
}
