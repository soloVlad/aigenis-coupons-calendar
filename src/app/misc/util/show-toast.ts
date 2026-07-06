import { inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

export async function showToast(message: string): Promise<void> {
  const toast = await inject(ToastController).create({
    message,
    duration: 3000,
    position: 'bottom',
  });

  await toast.present();
}
