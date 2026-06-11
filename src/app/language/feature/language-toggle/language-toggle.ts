import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { LocaleService } from '../../services';

@Component({
  selector: 'app-language-toggle',
  template: `
    <ion-button
      fill="clear"
      [attr.aria-label]="'common.language' | transloco"
      (click)="locale.toggleLocale()"
    >
      <ion-icon slot="icon-only" name="language-outline" />
    </ion-button>
  `,
  imports: [IonButton, IonIcon, TranslocoPipe],
})
export class LanguageToggle {
  protected readonly locale = inject(LocaleService);
}
