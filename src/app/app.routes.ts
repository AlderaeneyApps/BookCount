import { Routes } from '@angular/router';

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
    path: 'series/:id',
    loadComponent: () =>
      import('./pages/series/series-home/series-home.page').then(m => m.SeriesHomePage),
  },
  {
    path: 'volumes/:seriesId',
    loadComponent: () =>
      import('./pages/volumes/volumes-home/volumes-home.page').then(m => m.VolumesHomePage),
  },
];
