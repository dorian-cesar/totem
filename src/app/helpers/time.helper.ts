export function getCurrentDay(): string {
  const dayNro = new Date().getDay()
  const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

  return days[dayNro]
}

export function getDateWithoutFormat(date: string): string {
  return date.split('/').reverse().join('')
}

export function getCurrentDateOfPay(): string {
  const dateLocal = new Date().toLocaleString('es', { timeZone: 'America/Santiago' })

  let date = dateLocal.split(' ')[0]
  date = date.split('/').reverse().join('')

  let time = dateLocal.split(' ')[1]
  time = time.split(':').join('').substr(0, 4)

  return date + time
}
