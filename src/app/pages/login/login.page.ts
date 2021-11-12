import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import Keyboard from 'simple-keyboard'
import layout from 'simple-keyboard-layouts/build/layouts/spanish'

import { AuthService } from '@SERVICES/auth.service'
import { AlertService } from '@SERVICES/alert/alert.service'
import { getCurrentDay } from '@HELPERS/time.helper'

@Component({
  selector: 'app-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.page.html',
  styleUrls: [
    '../../../../node_modules/simple-keyboard/build/css/index.css',
    './login.page.scss'
  ]
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup
  public inputName = ''
  public enableKeyboard = false
  private keyboard: Keyboard

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.initForm()
  }

  public initForm(): void {
    this.loginForm = this.fb.group(
      {
        email: [
          '',
          [Validators.email, Validators.minLength(6), Validators.maxLength(40)]
        ],
        password: ['', [Validators.minLength(3), Validators.maxLength(30)]]
      },
      {
        validators: Validators.required
      }
    )
  }

  public login(): void {
    const { email, password } = this.loginForm.value as TLogin

    this.authService.login(email, password).subscribe(
      async () => {
        await this._router.navigate(['/auth/travel-detail'])
        this.loginForm.reset()
      },
      async (errorMessage: string) => {
        switch (errorMessage) {
          case 'Usuario no esta habilitado para comprar este día':
            await this.alertService.open(`
              Lo sentimos, usted no está habilitado para realizar compras los días
              ${getCurrentDay()}.<br />Compre sus pasajes cuando le corresponda.
              <br /><br />¡Hasta pronto!
            `)
            this.loginForm.reset()
            break

          case 'Email no encontrado':
            await this.alertService.open(`
              Lo sentimos, este correo no está habilitado para realizar compras en este
              tótem. Por favor intente con otra dirección de correo electrónico.
            `)
            this.loginForm.reset()
            break

          case 'la clave no coincide':
            await this.alertService.open('¡Contraseña Incorrecta!')
            this.loginForm.get('password').reset()
            break

          default:
            console.error('ERROR-LOGIN-> ', errorMessage)
            await this.alertService.open()
            this.loginForm.reset()
            break
        }
      }
    )
  }

  public onInputFocus(event: GenericEvent<HTMLInputElement>) {
    this.inputName = event.target.name

    if (this.enableKeyboard) {
      this.keyboard.setOptions({
        inputName: this.inputName
      })
    } else {
      this.enableKeyboard = true

      setTimeout(() => {
        this.activateKeyboard()
      }, 500)
    }
  }

  public onInputChange(event: GenericEvent<HTMLInputElement>): void {
    this.keyboard.setInput(event.target.value)
  }

  private activateKeyboard(): void {
    this.keyboard = new Keyboard({
      inputName: this.inputName,
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      ...layout
    })
  }

  private onChange(input: string): void {
    this.loginForm.get(this.inputName).setValue(input)
  }

  private handleShift(): void {
    const currentLayout = this.keyboard.options.layoutName
    const shiftToggle = currentLayout === 'default' ? 'shift' : 'default'

    this.keyboard.setOptions({
      layoutName: shiftToggle
    })
  }

  private onKeyPress(button: string): void {
    if (button === '{shift}' || button === '{lock}') this.handleShift()
  }
}
