import { Routes } from '@angular/router';
import { ACTION_TYPE } from './models';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'collections',
    pathMatch: 'full',
  },
  {
    path: 'collections',
    loadComponent: () =>
      import('./pages/collections/collections-home/collections-home.page').then(
        (m) => m.CollectionsHomePage,
      ),
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
    path: 'collections/edit/:id',
    loadComponent: () =>
      import('./pages/collections/collection-form/collection-form.page').then(
        (m) => m.CollectionFormPage,
      ),
    data: {
      mode: ACTION_TYPE.EDIT,
    },
  },
  {
    path: 'series/:id',
    loadComponent: () =>
      import('./pages/series/series-home/series-home.page').then(
        (m) => m.SeriesHomePage,
      ),
  },
  {
    path: 'series/create/:collectionId',
    loadComponent: () =>
      import('./pages/series/series-form/series-form.page').then(
        (m) => m.SeriesFormPage,
      ),
    data: {
      mode: ACTION_TYPE.CREATE,
    },
  },
  {
    path: 'series/edit/:seriesId/:collectionId',
    loadComponent: () =>
      import('./pages/series/series-form/series-form.page').then(
        (m) => m.SeriesFormPage,
      ),
    data: {
      mode: ACTION_TYPE.EDIT,
    },
  },
];
