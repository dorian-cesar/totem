export class SeatState {
  constructor(private seatsCol: TSeatsCol, private selectedSeat: TSeatExtend) {}

  public update(state: TState): TSeatsRow[] {
    const seatsColUpdated = this.seatsCol.map(seatsRow => {
      return <TSeatsRow>seatsRow.map((seat: TSeatExtend) => {
        if (seat.asiento === this.selectedSeat.asiento) {
          return <TSeatExtend>{
            ...seat,
            estado: state
          }
        } else return seat
      })
    })

    return seatsColUpdated
  }
}

export class SeatCache {
  private takedSeats: TTakedSeat[]

  constructor(private service?: TService) {}

  public getAll(): TTakedSeat[] {
    this.takedSeats = JSON.parse(localStorage.getItem('takedSeats')) || []
    return this.takedSeats
  }

  public save(seat: TSeatExtend): void {
    const newTakedSeat: TTakedSeat = {
      idService: this.service.idServicio,
      floor: seat.floor,
      nro: seat.asiento
    }

    this.takedSeats.push(newTakedSeat)
    localStorage.setItem('takedSeats', JSON.stringify(this.takedSeats))
  }

  public delete(seatNro: string): void {
    this.takedSeats = this.takedSeats.filter(takedSeat => takedSeat.nro !== seatNro)
    localStorage.setItem('takedSeats', JSON.stringify(this.takedSeats))
  }

  public reset(): void {
    localStorage.removeItem('takedSeats')
  }
}
