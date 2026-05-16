import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { IonInput, IonButton } from '@ionic/angular/standalone';
import { AuthApi } from '../../api/auth-api';
import { LoginRequest } from '../../type';
import { AuthController } from '../../util/auth-controller';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.html',
  styleUrls: ['./login-screen.scss'],
  imports: [IonInput, FormRoot, FormField, IonButton],
})
export class LoginScreen {
  readonly #authApi = inject(AuthApi);
  readonly #authCtrl = inject(AuthController);

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
      },
    });
  }
}
