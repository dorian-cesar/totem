// INPUTS
type TBodySeat = {
  servicio: string
  fecha: string
  origen: string
  destino: string
  asiento: string
}

type TBodyTicket = {
  clase: string
  descuento: string
  destino: string
  fechaSalida: string
  idServicio: string
  origen: string
  pago: string
  piso: number | string
  valor: string
  asiento: string
  promocion: string
  boleto?: null
  bus: string | null
  horaSalida: string | null
  rut: string | null
}

type TBodyCart = {
  asiento: string
  clase: string
  servicio: string
  fechaServicio: string
  fechaPasada: string
  horaSalida: string
  origen: string
  destino: string
  monto: number
  precio: number
  empresa: string
  bus: string
  piso: string
  integrador: number
}

type TBody = {
  templateVertical: {
    idServicio: string
    tipoBusPiso1: string
    tipoBusPiso2: string
    fechaServicio: string
    idOrigen: string
    idDestino: string
    integrador: number
    clasePiso1: string
    clasePiso2: string
  }
  takeSeat: TBodySeat & {
    rut: string
  }
  liberateSeat: TBodySeat & {
    integrador: number
  }
  searchServices: {
    origen: string
    destino: string
    fecha: string
    hora?: string
    idSistema?: number
  }
  agreement: {
    idConvenio: string
    listaAtributo: [
      {
        idCampo: string
        valor: string
      }
    ]
    listaBoleto: Array<TBodyTicket>
    mensaje: string
    montoTotal: string
    descuento: string
    totalApagar: string
    tipoError?: string | null
  }
  saveTrans: {
    email: string
    rut: string
    medioDePago: string
    puntoVenta: string
    montoTotal: number
    idSistema: number
    listaCarrito: Array<TBodyCart>
  }
  finalizeTrans: {
    orden: string
    codigoTransaccion: string
    numeroCuota: string
    numeroTarjeta: string
    tipoPago: string
    fechaCompra: string
    codigoRespuesta: 0
  }
}

// OUTPUTS
type TResponse = {
  login: {
    mensaje: {
      exito: boolean
      mensaje: string
    }
    nombre: string
    rut: string
  }
  takeSeat: {
    exito: boolean
    mensaje: string
  }
  liberateSeat: number
  agreement: TBody['agreement']
  saveTrans: {
    exito: boolean
    mensaje: string
    codigo: string
  }
  finalizeTrans: {
    estado: boolean
    mensaje: string
    error: boolean
    orden: string
    boletos: string[]
  }
}

type TOrigin = {
  codigo: string
  nombre: string
  region?: string
}

type TDestiny = {
  codigo: string
  nombre: string
  region?: string
}

// SERVICES
type TService = {
  busPiso1: string
  busPiso2?: string
  empresa: string
  fechaLlegada: string
  fechaSalida: string
  fechaServicio: string
  horaLlegada: string
  horaSalida: string
  idClaseBusPisoUno: string
  idClaseBusPisoDos?: string
  idServicio: string
  idTerminalDestino: string
  idTerminalOrigen: string
  integrador: number
  logo: string
  mascota: string
  servicioPrimerPiso: string
  servicioSegundoPiso?: string
  tarifaPrimerPiso: string
  tarifaPrimerPisoInternet: string
  tarifaSegundoPiso?: string
  tarifaSegundoPisoInternet?: string
  terminaLlegada: string
  terminalDestino: string
  terminalOrigen: string
  terminalSalida: string
}

// SEATS
type TSeat = {
  asiento: string
  estado: 'sinasiento' | 'pasillo' | 'libre' | 'ocupado'
  asientoAsociado: string | null
  tipo: string | null
}

type TSeatsRow = Array<TSeat>

type TSeatsCol = Array<TSeatsRow>

type TVerticalTemplate = {
  1: TSeatsCol
  2?: TSeatsCol
}
