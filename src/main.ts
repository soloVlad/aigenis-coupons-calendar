import { bootstrapApplication } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { languageOutline, logOutOutline } from 'ionicons/icons';
import { appConfig } from './app/app.config';
import { App } from './app/app';

addIcons({
  'log-out-outline': logOutOutline,
  'language-outline': languageOutline,
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
