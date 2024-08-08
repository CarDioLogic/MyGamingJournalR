import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonApp,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  IonContent,
  IonFooter,
  IonHeader,
  IonGrid,
  IonRow,
  IonAvatar,
  IonButton,
  IonIcon,
  IonButtons,
  IonTabs,
  IonTabBar,
  IonTabButton,  } from '@ionic/angular/standalone';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [ 
    IonTabButton,
    IonTabBar,
    IonTabs,
    IonButtons,
    CommonModule,
    IonIcon,
    IonButton,
    IonAvatar,
    IonRow,
    IonGrid,
    IonHeader,
    IonFooter,
    IonContent,
    IonToolbar,
    IonTitle,
    IonApp,
    IonRouterOutlet,
    UserMenuComponent,
  ],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('');
  }

  isAuth() {
    return this.authService.isAuthenticated();
  }
  navigateToPlayLater() {
    this.router.navigate(['./play-later']);
  }
  navigateToPlayed() {
    this.router.navigate(['./played']);
  }
  navigateToCurrentlyPlaying() {
    this.router.navigate(['./currently-playing']);
  }
  navigateToFinished() {
    this.router.navigate(['./finished']);
  }
  navigateToAllGames() {
    this.router.navigate(['./games-list']);
  }
}
