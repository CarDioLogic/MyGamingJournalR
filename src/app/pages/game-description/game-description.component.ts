import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { RawgService } from 'src/app/services/rawg.service';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserMenuComponent } from 'src/app/components/user-menu/user-menu.component';
@Component({
  standalone: true,
  imports: [
    IonLabel,UserMenuComponent,
    FormsModule,
    CommonModule,
    IonSelect,
    IonSelectOption,
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
    genres: [],
    platforms: [],
    publishers: [],
    developers: [],
    release_date: '',
    freetogame_profile_url: '',
    store: [],
  };

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesListService,
    private rawgService: RawgService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.game.id = params['id'];
      this.loadGame();
    });
  }
  isAuth() {
    return this.authService.isAuthenticated();
  }
  async AddToList() {
    let gameToAddToList = {
      rawgApiId: `${this.game.id}`,
      title: this.game.title,
      thumbnail: this.game.thumbnail,
      short_description: this.game.short_description,
      game_site_url: this.game.game_url,
      game_img_url: this.game.thumbnail,
      release_date: this.game.release_date,
      genres: this.game.genres,
      platforms: this.game.platforms,
      publishers: this.game.publishers,
      /*       developers: this.game.developers */
    };

    if (!this.game.currentList) {
      this.toastService.TriggerToast(`No list selected`, false);
      return;
    }

    this.gamesService
      .putGameToList(gameToAddToList, this.game.currentList)
      .subscribe(
        (response) => {
          this.toastService.TriggerToast(`Lists updated!`, true);

          console.log('Game successfully added:', response);
        },
        (error) => {
          this.toastService.TriggerToast(`Error adding game to list`, false);
        }
      );
  }

  loadGame() {
    this.rawgService.getGameById(this.game.id).subscribe({
      next: (response: any) => {
        console.log('this is the response', response);

        this.game = {
          ...this.game,
          id: response.id as string,
          title: response.name as string,
          thumbnail: response.background_image as string,
          //short_description: response.description_raw,
          release_date: response.released as string,
          genres: response.genres.map((genre: any) => genre.name),
          platforms: response.platforms.map(
            (platformObj: any) => platformObj.platform.name
          ),
          publishers: response.publishers.map((pub: any) => pub.name),
          developers: response.developers.map((dev: any) => dev.name),
          game_url: response.website,
        };
        response.stores.forEach((storeElement: any) => {
          this.game.store.push({
            name: storeElement.store.name,
            storeUrl: 'http://' + storeElement.store.domain,
          });
        });
        console.log(this.game);
      },
      error: (err) => {
        console.error('Error loading games', err);
      },
    });
  }
}
