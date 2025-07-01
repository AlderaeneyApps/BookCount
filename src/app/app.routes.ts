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
        m => m.CollectionsHomePage,
      ),
  },
  {
    path: 'collections/create',
    loadComponent: () =>
      import('./pages/collections/collection-form-v2/collection-form-v2.page').then(
        m => m.CollectionFormV2Page,
      ),
    data: {
      mode: ACTION_TYPE.CREATE,
    },
  },
  {
    path: 'collections/edit/:id',
    loadComponent: () =>
      import('./pages/collections/collection-form-v2/collection-form-v2.page').then(
        m => m.CollectionFormV2Page,
      ),
    data: {
      mode: ACTION_TYPE.EDIT,
    },
  },
  {
    path: 'series/:id',
    loadComponent: () =>
      import('./pages/series/series-home/series-home.page').then(m => m.SeriesHomePage),
  },
  {
    path: 'series/create/:collectionId',
    loadComponent: () =>
      import('./pages/series/series-form-v2/series-form-v2.page').then(m => m.SeriesFormV2Page),
    data: {
      mode: ACTION_TYPE.CREATE,
    },
  },
  {
    path: 'series/edit/:seriesId/:collectionId',
    loadComponent: () =>
      import('./pages/series/series-form-v2/series-form-v2.page').then(m => m.SeriesFormV2Page),
    data: {
      mode: ACTION_TYPE.EDIT,
    },
  },
  {
    path: 'volumes-home',
    loadComponent: () =>
      import('./pages/volumes/volumes-home/volumes-home.page').then(m => m.VolumesHomePage),
  },
];
