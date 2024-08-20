import { Component, OnInit } from '@angular/core';
import { GamesListService } from 'src/app/services/games-list.service';
import { Game } from 'src/app/models/game';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonRow,
  IonImg,
  IonLabel,
  IonModal,
  IonItem,
  IonInput,
  IonToast,
} from '@ionic/angular/standalone';

import { LoginComponent } from 'src/app/components/login/login.component';
import { RegisterComponent } from 'src/app/components/register/register.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    IonToast,
    IonInput,
    IonItem,
    IonModal,
    IonLabel,
    IonImg,
    IonRow,
    IonButtons,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class HomePage implements OnInit {
  games: Array<Game> = [];

  constructor(
    private modalCtrl: ModalController,
    private gamesService: GamesListService
  ) {}

  async openRegisterModal() {
    const modal = await this.modalCtrl.create({
      component: RegisterComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }
  async openLoginModal() {
    const modal = await this.modalCtrl.create({
      component: LoginComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

  ngOnInit() {
    this.initializeGamesList();
  }

  initializeGamesList() {
    this.gamesService.getGamesInRange(1, 3).subscribe({
      next: (data) => {
        if (data.length === 0) {
          console.log(data);
          throw new Error('No records found for the given range');
        }

        this.games = data;
        console.log('List of our games:', this.games);
      },
    });
  }
}
