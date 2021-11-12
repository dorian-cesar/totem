import { Injectable } from '@angular/core'
import { AlertController } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly DEFAULT_MESSAGE: 'Error de validación en el servidor.'

  constructor(private alertController: AlertController) {}

  public async open(
    message: string = this.DEFAULT_MESSAGE,
    closeHandler?: (value: any) => boolean | any
  ): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      cssClass: 'modal-alert',
      message,
      backdropDismiss: false,
      animated: true,
      buttons: [
        {
          text: '',
          role: 'cancel',
          cssClass: 'btn-cancel',
          handler: closeHandler
        }
      ]
    })

    await alert.present()

    return alert
  }
}
