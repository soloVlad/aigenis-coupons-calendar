import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
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
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LanguageToggle } from '../../../language';
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
  ],
})
export class LoginScreen {
  readonly #authApi = inject(AuthApi);
  readonly #authCtrl = inject(AuthController);
  readonly #router = inject(Router);

  protected readonly rememberCredentials = signal(false);

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
    this.#authApi.login(this.loginModel()).subscribe({
      next: async (response) => {
        this.#authCtrl.accessToken = response.access;

        if (this.rememberCredentials()) {
          await this.#authCtrl.saveCredentials(this.loginModel());
        } else {
          await this.#authCtrl.clearCredentials();
        }

        await this.#router.navigate(['/calendar']);
      },
    });
  }
}
