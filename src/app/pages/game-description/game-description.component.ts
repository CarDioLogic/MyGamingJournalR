import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { Game } from 'src/app/models/game';
import { GamesListService } from 'src/app/services/games-list.service';
import { IonFooter, IonBackButton, IonMenuButton, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonCard, IonImg, IonCardContent, IonIcon, IonFabButton, IonFab, IonInfiniteScroll, IonInfiniteScrollContent, IonMenu, IonButtons, IonButton, IonSearchbar, IonItem } from '@ionic/angular/standalone';

@Component({
  standalone:true,
  imports: [IonItem, IonSearchbar, IonBackButton, IonFooter,
    IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonCard, IonImg, IonCardContent, IonIcon, IonButtons, IonButton,
    IonFab, IonFabButton, IonInfiniteScroll, IonInfiniteScrollContent, IonMenu, IonMenuButton
  ],
  selector: 'app-game-description',
  templateUrl: './game-description.component.html',
  styleUrls: ['./game-description.component.scss'],
})
export class GameDescriptionComponent  implements OnInit {
  game: Game = {
    id:'',
    title:'',
    thumbnail:'',
    short_description:'',
    game_url:'',
    genre:'',
    platform:'',
    publisher:'',
    developer:'',
    release_date:'',
    freetogame_profile_url:'',
  };

  constructor(private route:ActivatedRoute,
    private gamesService:GamesListService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.game.id = params['id'];
      this.loadGame();
    });
  }

  loadGame() {
    this.gamesService.getGamesDetailedInfoById(this.game.id).subscribe({
      next: (response: any) => {
        this.game = response;
        console.log("Game loaded:", this.game);

      },
      error: (err) => {
        console.error('Error loading games', err);
      },
    });
  }
}
