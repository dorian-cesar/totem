type TLogin = {
  email: string
  password: string
}

type TFloors = Array<TSeatsCol>

type TState = TSeat['estado'] | 'tomado' | 'loading'

type TUser = {
  name: string
  email: string
  rut: string
}

type TTravel = {
  origen: TOrigin
  destino: TDestiny
  ida: string
  vuelta: string
}

type TTotal = {
  subtotal: string
  discount: string
  total: string
}

type TTravelType = 'ida' | 'vuelta' | 'ida_vuelta'

type TSelectTravel = {
  travel: TTravel
  type: TTravelType
}

type TViews = 'travel' | 'services' | 'seats' | 'confirmation' | 'payment'

type TTicketView = {
  items: Array<{
    title: string
    description: string
  }>
  subtotal: string
}

type TConfirmation = {
  view: TTicketView
  bodyList: TBodyTicket
  total: TTotal
}

type TTicket = {
  list: Array<{
    travel: TTravel
    service: TService
    seats: TTakedSeat[]
  }>
  total: number
}

type TSeatExtend = TSeat & {
  floor: number
}

type TTakedSeat = {
  idService: string
  floor: number
  nro: string
}

// INTERFACES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

interface GenericEvent<T> extends Omit<Event, 'target'> {
  target: T
}
