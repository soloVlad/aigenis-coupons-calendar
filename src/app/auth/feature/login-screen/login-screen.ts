import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { LanguageToggle } from '../../../language';
import { showToast } from '../../../misc';
import { AuthApi } from '../../api/auth-api';
import { LoginRequest } from '../../type';
import { AuthController } from '../../util/auth-controller';

@Component({
  selector: 'app-login-screen',
  host: { class: 'ion-page' },
  templateUrl: './login-screen.html',
  styleUrls: ['./login-screen.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonFooter,
    IonInput,
    IonInputPasswordToggle,
    IonItem,
    IonCheckbox,
    FormRoot,
    FormField,
    IonButton,
    TranslocoPipe,
    LanguageToggle,
    IonSpinner,
  ],
})
export class LoginScreen {
  readonly #authApi = inject(AuthApi);
  readonly #authCtrl = inject(AuthController);
  readonly #router = inject(Router);
  readonly #transloco = inject(TranslocoService);
  readonly #toastCtrl = inject(ToastController);

  protected readonly rememberCredentials = signal(false);
  protected readonly loading = signal(false);

  protected loginModel = signal<LoginRequest>({
    phone: '',
    password: '',
  });

  protected loginForm = form(this.loginModel, {
    submission: {
      action: this.#login.bind(this),
    },
  });

  async #login() {
    this.loading.set(true);

    try {
      const response = await firstValueFrom(this.#authApi.login(this.loginModel()));
      this.#authCtrl.accessToken = response.access;

      if (this.rememberCredentials()) {
        await this.#authCtrl.saveCredentials(this.loginModel());
      } else {
        await this.#authCtrl.clearCredentials();
      }

      await this.#router.navigate(['/calendar']);
    } catch {
      await showToast(this.#toastCtrl, this.#transloco.translate('errors.loginFailed'), 'danger');
    } finally {
      this.loading.set(false);
    }
  }
}
