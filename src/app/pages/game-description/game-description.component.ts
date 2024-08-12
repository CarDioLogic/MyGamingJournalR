import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { Game } from 'src/app/models/game';
import { GamesListService } from 'src/app/services/games-list.service';
import {
  IonFooter,
  IonBackButton,
  IonMenuButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonImg,
  IonCardContent,
  IonIcon,
  IonFabButton,
  IonFab,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonMenu,
  IonButtons,
  IonButton,
  IonSearchbar,
  IonItem,
} from '@ionic/angular/standalone';
import { RawgService } from 'src/app/services/rawg.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonSearchbar,
    IonBackButton,
    IonFooter,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonImg,
    IonCardContent,
    IonIcon,
    IonButtons,
    IonButton,
    IonFab,
    IonFabButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonMenu,
    IonMenuButton,
  ],
  selector: 'app-game-description',
  templateUrl: './game-description.component.html',
  styleUrls: ['./game-description.component.scss'],
})
export class GameDescriptionComponent implements OnInit {
  game: Game = {
    id: '',
    title: '',
    thumbnail: '',
    short_description: '',
    game_url: '',
    genre: '',
    platform: '',
    publisher: '',
    developer: '',
    release_date: '',
    freetogame_profile_url: '',
    store: []
  };

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesListService,
    private rawgService: RawgService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.game.id = params['id'];
      this.loadGame();
    });
  }

  loadGame() {
    this.rawgService.getGameById(this.game.id).subscribe({
      next: (response: any) => {
        console.log(response);

        this.game = {
          ...this.game,
          id: response.id as string,
          title: response.name as string,
          thumbnail: response.background_image as string,
          release_date: response.released as string,
          genre: response.genres.map((genre: any) => genre.name).join(', '),
          platform: response.platforms
            .map((platform: any) => platform.platform.name)
            .join(', '),
          developer: response.developers.map((dev: any) => dev.name).join(', '),
          publisher: response.publishers.map((pub: any) => pub.name).join(', '),
          game_url: response.website,
        };
        response.stores.forEach((storeElement: any) => {
          this.game.store.push({
            name: storeElement.store.name,
            storeUrl: 'http://' + storeElement.store.domain,
          });
        });
        console.log(this.game)
      },
      error: (err) => {
        console.error('Error loading games', err);
      },
    });
  }
}
