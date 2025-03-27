import { Routes } from '@angular/router';
import { ACTION_TYPE } from './models';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'collections',
    pathMatch: 'full',
  },
  {
    path: 'collections/create',
    loadComponent: () =>
      import('./pages/collections/collection-form/collection-form.page').then(
        (m) => m.CollectionFormPage,
      ),
    data: {
      mode: ACTION_TYPE.CREATE,
    },
  },
  {
    path: 'collections',
    loadComponent: () =>
      import('./pages/collections/collections-home/collections-home.page').then(
        (m) => m.CollectionsHomePage,
      ),
  },
];
