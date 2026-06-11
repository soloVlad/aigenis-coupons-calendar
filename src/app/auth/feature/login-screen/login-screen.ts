import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
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
    IonContent,
    IonFooter,
    IonInput,
    IonInputPasswordToggle,
    FormRoot,
    FormField,
    IonButton,
  ],
})
export class LoginScreen {
  readonly #authApi = inject(AuthApi);
  readonly #authCtrl = inject(AuthController);
  readonly #router = inject(Router);

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
      next: (response) => {
        this.#authCtrl.accessToken = response.access;
        this.#router.navigate(['/calendar']);
      },
    });
  }
}
