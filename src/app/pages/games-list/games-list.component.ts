import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Route, Router, ActivatedRoute, RouterLink } from '@angular/router';
import { GamesListService } from 'src/app/services/games-list.service';
import { RawgService } from 'src/app/services/rawg.service';
import { Game } from 'src/app/models/game';
import {
  ToastController,
  IonToast,
  IonSelect,
  IonSelectOption,
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
  IonFooter,
  IonLabel,
} from '@ionic/angular/standalone';
import { FilterMenuComponent } from 'src/app/components/filter-menu/filter-menu.component';
import { FilterParams } from 'src/app/models/filterParams';

import { UserGamingList } from 'src/app/models/userGamingList';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: true,
  imports: [
    IonLabel,
    IonToast,
    IonFooter,
    IonItem,
    IonSearchbar,
    FormsModule,
    RouterLink,
    CommonModule,
    IonSelect,
    IonSelectOption,
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
    FilterMenuComponent,
    IonMenuButton,
  ],
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
})
export class GamesListComponent implements OnInit {
  games: Array<Game> = [];
  filteredGames: Array<Game> = [];
  filter: FilterParams | undefined;
  searchGameTitleQuery: string | undefined;
  
  GamingList: UserGamingList = {
    id: '',
    userId: '',
    games: [],
  };

  page: number = 1;
  maxPages: number = 0;
  itemsPerPage: number = 10;
  user: any;

  constructor(
    private gamesService: GamesListService,
    private rawgService: RawgService,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.handleRefresh();
    this.user = this.authService.getLoggedInUser();
  }

  loadGames() {
    this.page = 1;
    this.rawgService
      .getGamesPaginate(
        this.page,
        this.itemsPerPage,
        this.filter?.platform,
        this.filter?.genre,
        this.searchGameTitleQuery
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          /*           this.maxPages = response.pages;
           */

          this.games = response.results.map((result: any) => ({
            id: result.id as string,
            title: result.name as string,
            thumbnail: result.background_image as string,
            release_date: result.released as string,
            /*           genre: result.genre, */
            /*           platform: result.platform, */
          }));

          this.filteredGames = [...this.games];
          console.log(this.games);
        },
        error: (err) => {
          console.error('Error loading games', err);
        },
      });
  }

  handleRefresh(event?: any) {
    this.loadGames();
    if (event) {
      event.target.complete();
    }
  }

  onIonInfinite(event: any): void {
    /*     if (this.page >= this.maxPages) {
      event.target.complete();
      return;
    } */

    this.page++;
    this.rawgService
      .getGamesPaginate(
        this.page,
        this.itemsPerPage,
        this.filter?.platform,
        this.filter?.genre,
        this.searchGameTitleQuery
      )
      .subscribe({
        next: (response: any) => {
          //when there are no more pages, end!
          if (response.next == null) {
            event.target.complete();
            return;
          }

          console.log(response);
          /*           this.games.push(...response.data);
          this.filteredGames.push(...response.data); */

          this.games = response.results.map((result: any) => ({
            id: result.id as string,
            title: result.name as string,
            thumbnail: result.background_image as string,
            release_date: result.released as string,
            /*           genre: result.genre, */
            /*           platform: result.platform, */
          }));
          this.filteredGames.push(...this.games);

          event.target.complete();
        },
      });
  }

  trackByIndex(index: number, item: Game) {
    return index;
  }

  filterGames(event: FilterParams) {
    console.log('filter:', event);
    this.filter = event;
    this.games = [];
    this.filteredGames = [];
    this.handleRefresh();
  }

  orderGames(event: string) {
    if (event === 'alphabet') {
      this.orderGamesAlphabetically();
    } else if (event === 'release_date') {
      this.orderGamesByReleaseDate();
    }
    console.log('Games re-ordered:', this.games);
  }

  orderGamesAlphabetically(): void {
    this.filteredGames = this.filteredGames.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  orderGamesByReleaseDate(): void {
    this.filteredGames = this.filteredGames.sort((a, b) =>
      a.release_date.localeCompare(b.release_date)
    );
  }

  onSearchInput(event: any): void {
    this.searchGameTitleQuery = event.target.value;
    //to search games on local list only
    /*     this.filteredGames = this.games.filter((game) =>
      game.title.toLowerCase().includes(searchTerm)
    ); */
  }

  onSearchEnter() {
    this.loadGames();
  }

  async AddToList(game: Game) {
    if (!game.currentList) {
      this.TriggerToast(`No list selected`, false);
      return;
    }

    await this.removeGameFromAllLists(game);
    await this.getUserGamesList(game);

    const gameExists = this.GamingList.games.some(
      (existingGame) => existingGame.gameId === game.id
    );

    if (gameExists) {
      this.TriggerToast(`Game already exists in the list`, null);
    } else {
      this.GamingList.games.push({
        gameId: game.id,
        createDate: new Date().toISOString(),
      });

      console.log('Updated GamingList:', this.GamingList);

      this.gamesService
        .putGameToList(this.GamingList, game.currentList)
        .subscribe(
          (response) => {
            this.TriggerToast(`Lists updated!`, true);

            console.log('Game successfully added:', response);
          },
          (error) => {
            this.TriggerToast(`Error adding game to list`, false);
          }
        );
    }
  }

  async getUserGamesList(game: Game): Promise<void> {
    try {
      const response = await this.gamesService
        .getUserGamesListByUserId(this.user.id, game.currentList)
        .toPromise();
      this.GamingList = response[0];
      console.log('User', this.user, 'User gaming list:', this.GamingList);
    } catch (error) {
      console.log('Error getting user gaming list!', error);
      throw error;
    }
  }

  async TriggerToast(toastMessage: string, isToastSuccess: boolean | null) {
    let toastCssClass = '';
    if (isToastSuccess === true) {
      toastCssClass = 'success-toast';
    } else if (isToastSuccess === false) {
      toastCssClass = 'error-toast';
    } else {
      toastCssClass = 'neutral-toast';
    }

    const toast = await this.toastController.create({
      cssClass: toastCssClass,
      message: toastMessage,
      position: 'top',
      duration: 2000,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }


  removeGameFromAllLists(game: Game) {
    this.gamesService
      .removeGameFromAllLists(game.id, this.GamingList.userId)
      .then(() => {
        console.log('Game removed successfully from all lists.');
        console.log(game.id, this.GamingList.userId);
      })
      .catch(() => {
        console.error('Error removing game from all lists.');
      });
  }
}
