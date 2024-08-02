import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Route, Router, ActivatedRoute, RouterLink } from '@angular/router';
import { GamesListService } from 'src/app/services/games-list.service';
import { Game } from 'src/app/models/game';
import { IonToast, ToastController, IonMenuButton, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonCard, IonImg, IonCardContent, IonIcon, IonFabButton, IonFab, IonInfiniteScroll, IonInfiniteScrollContent, IonMenu, IonButtons, IonButton, IonSearchbar, IonItem, IonFooter, IonLabel } from '@ionic/angular/standalone';
import { FilterMenuComponent } from 'src/app/components/filter-menu/filter-menu.component';
import { FilterParams } from 'src/app/models/filterParams';
import { AuthService } from 'src/app/services/auth.service';
import { UserGamingList } from 'src/app/models/userGamingList';

@Component({
  standalone: true,
  imports: [IonLabel,IonToast, IonFooter, IonItem, IonSearchbar, FormsModule, RouterLink, CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonCard, IonImg, IonCardContent, IonIcon, IonButtons, IonButton,
    IonFab, IonFabButton, IonInfiniteScroll, IonInfiniteScrollContent, IonMenu, FilterMenuComponent, IonMenuButton
  ],
  selector: 'app-played',
  templateUrl: './played.component.html',
  styleUrls: ['./played.component.scss'],
})
export class PlayedComponent  implements OnInit {
  games: Array<Game> = [];
  filteredGames: Array<Game> = [];
  filter: FilterParams | undefined;
  searchGameTitleQuery:string | undefined;
  user:any;
  GamingList: UserGamingList = {
    id: '',
    userId: '',
    games: [],
  };

  constructor(
    private gamesService: GamesListService,
    private authService: AuthService,
    private toastController: ToastController,

  ) {}


  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
    if (this.user) {
      this.loadGames();
    } else {
      console.error('No logged-in user found.');
    }
  }

  loadGames() {
    this.gamesService.getUserGamesListByUserId(this.user.id, 'usersListPlayed').subscribe({
      next: (response: any) => {
        this.GamingList = response[0];
        console.log(this.GamingList)

          this.GamingList.games.forEach(game => {
            this.addGameToGamesList(game.gameId);
          });
  
      },
      error: (err) => {
        console.error('Error loading gaming list', err);
      },
      complete: () => {
        console.log(this.games);
      }
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
/*   searchGameByTitle(){
  //opted to search for the game title locally instead of searching trough api request
  //api does not support partial matching, so the title had to be exactly the same as the one in the DB
    console.log("Filter by title:", this.searchGameTitleQuery);
    this.games = [];
    this.handleRefresh();
  } */

    onSearchInput(event: any): void {
      this.searchGameTitleQuery = event.target.value.toLowerCase();
      this.applyFilters();
    }
    applyFilters(): void {
      this.filteredGames = this.games.filter(game => {
        const matchesSearchQuery = !this.searchGameTitleQuery || game.title.toLowerCase().includes(this.searchGameTitleQuery);
        const matchesGenre = !this.filter?.genre || game.genre === this.filter.genre;
        const matchesPlatform = !this.filter?.platform || game.platform === this.filter.platform;
        return matchesSearchQuery && matchesGenre && matchesPlatform;
      });
    }
    removeGameFromList(gameId:string, listName:string){
      this.GamingList.games = this.GamingList.games.filter(game => game.gameId !== gameId);

      // Optionally, update the filteredGames if you are using it for display
      this.filteredGames = this.filteredGames.filter(game => game.id !== gameId);
      this.games = this.games.filter(game => game.id !== gameId);

      this.gamesService.putGameToList(this.GamingList, 'usersListPlayed').subscribe({
        next: (response: any) => {
          this.TriggerToast(`Removed game from list`, true);

        },
        error: (err) => {
          this.TriggerToast(`Error removing game from list`, false);
        },
        complete: () => {
          console.log(this.games);
        }
      });
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
}
