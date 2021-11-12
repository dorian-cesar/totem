import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, from } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public login(email: string, clave: string): Observable<TUser | string> {
    const loginObservable = from<Promise<TUser | string>>(
      new Promise(async (resolve, reject) => {
        const endpoint = '/srv-centinela-web/rest/venta/login'
        const body = { email, clave }

        const resp = await this.http
          .post<TResponse['login']>(endpoint, JSON.stringify(body))
          .toPromise()

        if (resp.mensaje.exito) {
          const user: TUser = {
            name: resp.nombre,
            email,
            rut: resp.rut
          }

          localStorage.setItem('user', JSON.stringify(user))

          resolve(user)
        } else reject(resp.mensaje.mensaje)
      })
    )

    return loginObservable
  }

  public user(): TUser {
    return JSON.parse(localStorage.getItem('user')) as TUser
  }
}
