import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor( private toastController: ToastController,
  ) { }

  async TriggerToast(toastMessage: string, isToastSuccess: boolean | null) {
    let toastCssClass = '';
    if (isToastSuccess === true) {
      toastCssClass = 'success-toast';
    } else if (isToastSuccess === false) {
      toastCssClass = 'error-toast';
    } else {
      toastCssClass = 'neutral-toast';
    }

    const toast = await this.toastController.create({
      cssClass: toastCssClass,
      message: toastMessage,
      position: 'top',
      duration: 2000,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }
}
