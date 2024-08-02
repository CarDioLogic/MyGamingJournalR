import { Routes } from '@angular/router';
import { AuthGuard } from './guards/authGuard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'user-homepage',
    loadComponent: () => import('./pages/user-homepage/user-homepage.component').then((m) => m.UserHomepageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'games-list',
    loadComponent: () => import('./pages/games-list/games-list.component').then((m) => m.GamesListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'game-description/:id',
    loadComponent: () => import('./pages/game-description/game-description.component').then((m) => m.GameDescriptionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-menu',
    loadComponent: () => import('./components/user-menu/user-menu.component').then((m) => m.UserMenuComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'currently-playing',
    loadComponent: () => import('./pages/users-gaming-lists/currently-playing-list/currently-playing-list.component').then((m) => m.CurrentlyPlayingListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'finished',
    loadComponent: () => import('./pages/users-gaming-lists/finished-list/finished-list.component').then((m) => m.FinishedListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'play-later',
    loadComponent: () => import('./pages/users-gaming-lists/play-later-list/play-later-list.component').then((m) => m.PlayLaterListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'played',
    loadComponent: () => import('./pages/users-gaming-lists/played/played.component').then((m) => m.PlayedComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/user-homepage/user-homepage.component').then((m) => m.UserHomepageComponent),
    canActivate: [AuthGuard]
  },
];
