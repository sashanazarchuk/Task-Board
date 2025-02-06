import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { BoardEffects } from './board/store/board-effects';
import { boardReducer } from './board/store/board-reducer';
import { CardListEffect } from './list/store/list-effects';
import { listReducer } from './list/store/list-reducer';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideHttpClient(withFetch()),
  provideAnimationsAsync(),
  provideStore({
    boards: boardReducer,
    lists: listReducer
  }),
  provideEffects([BoardEffects, CardListEffect]),
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
