import { Injectable } from '@angular/core'
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { environment } from '@ENV'

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  readonly URL_BASE: string = environment.api

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const contentType: string = req.headers.get('Content-Type')
    const url: string = this.URL_BASE + req.url

    const reqClone = req.clone({
      url,
      headers: new HttpHeaders({
        'Content-Type': contentType || 'application/json'
      })
    })

    return next.handle(reqClone).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('REQUEST-ERROR ->', err.message)

        return throwError({
          status: err.status,
          error: err.error
        })
      })
    )
  }
}
