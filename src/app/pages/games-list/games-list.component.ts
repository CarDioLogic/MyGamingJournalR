import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Route, Router, ActivatedRoute, RouterLink } from '@angular/router';
import { GamesListService } from 'src/app/services/games-list.service';
import { RawgService } from 'src/app/services/rawg.service';
import { Game } from 'src/app/models/game';
import {
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
import { ToastService } from 'src/app/services/toast.service';
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

  page: number = 1; //do i need this ?
  maxPages: number = 0; //do i need this ?
  itemsPerPage: number = 10;
  nextPageUrl: string = '';
  user: any;

  constructor(
    private gamesService: GamesListService,
    private rawgService: RawgService,
    private authService: AuthService,
    private toastService: ToastService
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
        this.filter?.platforms.map((platform: { id: any }) => platform.id).join(', '),
        this.filter?.genres.map((genre: { id: any }) => genre.id).join(', '),
        this.searchGameTitleQuery
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);

          this.nextPageUrl = response.next;

          this.games = response.results.map((result: any) => ({
            id: result.id as string,
            title: result.name as string,
            thumbnail: result.background_image as string,
            release_date: result.released as string,
            genres: result.genres.map((genreObj: any) => genreObj.name),
            platforms: result.platforms.map(
              (platformObj: any) => platformObj.platform.name
            ),
          }));

          this.filteredGames = [...this.games];
          console.log(response);
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
    this.page++;
    this.rawgService
      .getGamesPaginate(
        this.page,
        this.itemsPerPage,
        this.filter?.platforms.map((platform: { id: any }) => platform.id).join(', '),
        this.filter?.genres.map((genre: { id: any }) => genre.id).join(', '),
        this.searchGameTitleQuery
      )
      .subscribe({
        next: (response: any) => {
          //response.next gives the request url to get items of the next page
          //when there are no more pages, end!
          if (response.next == null) {
            event.target.complete();
            return;
          }

          console.log(response);

          this.games = response.results.map((result: any) => ({
            id: result.id as string,
            title: result.name as string,
            thumbnail: result.background_image as string,
            release_date: result.released as string,
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
  }

  onSearchEnter() {
    this.loadGames();
  }
}
