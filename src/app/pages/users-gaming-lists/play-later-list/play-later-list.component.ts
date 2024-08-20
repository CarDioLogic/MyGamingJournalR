import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Route, Router, ActivatedRoute, RouterLink } from '@angular/router';
import { GamesListService } from 'src/app/services/games-list.service';
import { Game } from 'src/app/models/game';
import { IonToast, ToastController, IonMenuButton, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonCard, IonImg, IonCardContent, IonIcon, IonFabButton, IonFab, IonInfiniteScroll, IonInfiniteScrollContent, IonMenu, IonButtons, IonButton, IonSearchbar, IonItem, IonFooter, IonLabel, IonActionSheet } from '@ionic/angular/standalone';
import { FilterMenuComponent } from 'src/app/components/filter-menu/filter-menu.component';
import { FilterParams } from 'src/app/models/filterParams';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserMenuComponent } from 'src/app/components/user-menu/user-menu.component';

@Component({
  standalone: true,
  imports: [UserMenuComponent,IonActionSheet, IonLabel,IonToast, IonFooter, IonItem, IonSearchbar, FormsModule, RouterLink, CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonCard, IonImg, IonCardContent, IonIcon, IonButtons, IonButton,
    IonFab, IonFabButton, IonInfiniteScroll, IonInfiniteScrollContent, IonMenu, FilterMenuComponent, IonMenuButton
  ],
  selector: 'app-play-later-list',
  templateUrl: './play-later-list.component.html',
  styleUrls: ['./play-later-list.component.scss'],
})
export class PlayLaterListComponent  implements OnInit {
  games: Array<Game> = [];
  filteredGames: Array<Game> = [];
  filter: FilterParams | undefined;
  searchGameTitleQuery:string | undefined;
  user:any;

  constructor(
    private gamesService: GamesListService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}


  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
    if (this.user) {
      this.loadGames();
    } else {
      console.error('No logged-in user found.');
    }
  }
  isAuth() {
    return this.authService.isAuthenticated();
  }
  public actionSheetButtons = [
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  confirmDelete(ev: any, id:string) {
    if (ev.detail.role === 'destructive') {
      this.removeGameFromList(id);
    }
  }

  removeGameFromList(id: string) {
    this.gamesService.removeGameFromLists(id).subscribe({
      next: (response:any)=>{
        this.toastService.TriggerToast('Game removed from list', true);
        this.filteredGames = this.filteredGames.filter(game => game.id !== id);

      },
      error: (err) =>{
        this.toastService.TriggerToast('Error removing game from list.', false);
      }
    })
  }


  loadGames() {
    this.gamesService.getUserGamesList('playLaterGames').subscribe({
      next: (response: any) => {
        console.log('GAMES LIST', response);
        this.games = response.map((result: any) => ({
          id: result.games.id as string,
          title: result.games.title as string,
          thumbnail: result.games.thumbnail as string,
          release_date: result.games.release_date as string,


          genres: result.games.genres.map((genreObj: any) => genreObj.name),
          platforms: result.games.platforms.map(
            (platformObj: any) => platformObj.name
          ),
        }));
        this.filteredGames = [...this.games];
      },
      error: (err) => {
        console.error('Error loading gaming list', err);
      },
      complete: () => {
        console.log(this.games);
      },
    });
  }
/*   this.filteredGames = [...this.games];
 */
  addGameToGamesList(id:string){
    this.gamesService.getGamesById(id).subscribe({
      next: (response: any) => {
        console.log("game", response)
          this.games.push(response);
          this.filteredGames.push(response);
          console.log("games",this.filteredGames)
      }
    })
  }

  trackByIndex(index: number, item: Game) {
    return index;
  }

  filterGames(event: FilterParams) {
    console.log("filter:", event);
    this.filter = event;
    this.applyFilters();
  }

  orderGames(event: string) {
    if (event === "alphabet") {
      this.orderGamesAlphabetically();
    } else if (event === "release_date") {
      this.orderGamesByReleaseDate();
    }
    console.log("Games re-ordered:", this.games);
  }

  orderGamesAlphabetically(): void {
    this.filteredGames = this.filteredGames.sort((a, b) => a.title.localeCompare(b.title));
  }

  orderGamesByReleaseDate(): void {
    this.filteredGames = this.filteredGames.sort((a, b) => a.release_date.localeCompare(b.release_date));
  }
    onSearchInput(event: any): void {
      this.searchGameTitleQuery = event.target.value.toLowerCase();
      this.applyFilters();
    }
    applyFilters(): void {
      this.filteredGames = this.games.filter((game) => {
        const matchesSearchQuery =
          !this.searchGameTitleQuery ||
          game.title
            .toLowerCase()
            .includes(this.searchGameTitleQuery.toLowerCase());
  
        const matchesGenre =
          !this.filter?.genres ||
          this.filter.genres.length === 0 ||
          this.filter.genres.some((genre) => game.genres?.includes(genre.name));
  
        const matchesPlatform =
          !this.filter?.platforms ||
          this.filter.platforms.length === 0 ||
          this.filter.platforms.some((platform) =>
            game.platforms?.includes(platform.name)
          );
  
        console.log('genres', matchesGenre);
        console.log('platforms', matchesPlatform);
  
        return matchesSearchQuery && matchesGenre && matchesPlatform;
      });
    }
    
}
