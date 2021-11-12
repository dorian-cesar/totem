# NOTAS

- ## Servicio: Tomar Asiento

Para que de error al seleccionar asientos el usuario ya debe tener comprado un boleto para
ese servicio, por lo tanto no se puede comprar mas de una vez por servicio

- ## Servicio: Buscar Estructura de Bus

Casos de usos y soluciones:

1. El usuario ha seleccionado asientos y la app falla:

**Problema:** El usuario ha seleccionado asientos pero en el transcurso sucede un evento
que provoca que falle la aplicacion (falta de internet, falla la pagina, se detiene el
nevegador, etc) lo que ocaciona que el proceso se reinicie y el usuario deba repetir el
flujo.

**Solución:** Para estos casos se deben guardar en el navegador los asientos que el
usuario previamente a seleccionado, para liberarlos en el momento que se vuelva a entrar a
la vista de seleccion de asientos, de esta manera se previene que el usuario visualice
asientos ocupados que han sido generados por su actividad anterior.

2. El usuario selecciona hacientos que otra persona ya ha reservado momentos antes

**Problema:** La vista de seleccion de asiento carga la estructura del bus y el usuario se
dispone hacer la seleccion, pero en ese momento otro usuario instantes antes ha hecho lo
mismo, por lo que la selección de este ultimo usuario se realiza primero.

**Solución:** Desde backend implementar un servicio de websocket para mantener actualizado
la estructura del bus

3. Todos los asientos se encuentran ocupados y el usuario espera que se libere uno:

**Solución:** Desde backend implementar un servicio de websocket para mantener actualizado
la estructura del bus

Nombre de los asientos:

| Nombres | Descripción                      |
| ------- | -------------------------------- |
| B1, B2  | baños                            |
| X       | espacios entre filas de asientos |
| %       | espacios entre asientos          |
| 1,... N | asientos disponibles             |

Estado de los asientos:

- sinasiento
- pasillo
- libre
- ocupado

Estructura del bus:

```js
{
  1: [
    [
      {
        asiento: "1",
        asientoAsociado: "",
        estado: "ocupado",
        tipo: null,
        usuario: "14485557-4" // Posible propiedad requerida
      },
      {
        /* ... */
      }
    ],
    [
      /* ... */
    ]
  ],
  2: [
    /* ... */
  ]
}
```

- ## Servicio: POS (Point of Sale)

La Máquina POS es un dispositivo de tipo electrónico con una pantalla y un teclado. Se
trata de una tecnología que se adapta a los pagos a través de tarjetas de débito y de
crédito.

Caracteristicas:

- La comunicación se realiza por medio de websocket
- La conección tiene un tiempo limite de 5 minutos y existe un maximo de 3 intentos

- ## Servicio: Crear Transacción

Casos de uso y soluciones:

1. El usuario demora en pagar y pullman libera los asientos:

El usuario le da al boton "pagar", entonces se procede a realizar la comunicacion por
websocket con la pasarela de pago crea la transacción pero este demora en finalizar la
transacción por lo que los asientos desde el backend (server, api, DB) se liberan antes de
que el usuario pague, que sucede aca ?

- La api le permite al usuario finalizar la transacción pero los asientos no han sido
  reservados lo que ocaciona que otro usuario pueda comprarlos.
- La api no le permite al usuario finalizar la transacción, (se genera un error en el
  request) y el usuario debe repetir el flujo de selección de asientos.
