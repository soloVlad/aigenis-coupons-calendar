import { ToastController, ToastOptions } from '@ionic/angular/standalone';

export async function showToast(
  toastController: ToastController,
  message: string,
  color?: ToastOptions['color'],
): Promise<void> {
  const toast = await toastController.create({
    message,
    duration: 3000,
    position: 'top',
    color,
  });

  await toast.present();
}
