import { Component, OnInit, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatformService } from 'src/app/services/platform.service';
import { GenresService } from 'src/app/services/genres.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher,
  IonRefresherContent, IonCard, IonImg, IonCardContent, IonIcon, 
  IonFabButton, IonFab, IonInfiniteScroll, IonInfiniteScrollContent, IonItem,
  IonMenuToggle, IonList, IonLabel, IonChip, IonSelect, IonSelectOption, IonButton,
} from '@ionic/angular/standalone';
import { Platform } from 'src/app/models/platform';
import { Genre } from 'src/app/models/genre';
import { FilterParams } from 'src/app/models/filterParams';
import { Route, Router, ActivatedRoute, RouterLink } from '@angular/router';


@Component({
  standalone:true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher,
    IonRefresherContent, IonCard, IonImg, IonCardContent, IonIcon,
    IonFab, IonFabButton, IonInfiniteScroll, IonInfiniteScrollContent,
    IonItem, IonMenuToggle, IonList, IonLabel, IonChip,
    CommonModule, IonSelect, IonSelectOption, FormsModule, IonButton
  ],
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss'],
})
export class FilterMenuComponent  implements OnInit {
  sortByAlphabet: boolean = false;
  sortByReleaseDate: boolean = false;
  platforms: Array<Platform> = [];
  genres: Array<Genre> = [];
  selectedFilterParams:FilterParams = {
    genre: '',
    platform: '',
  }

  @Output() filterParameter = new EventEmitter<FilterParams>();
  @Output() orderParameter = new EventEmitter<string>();

  constructor(
    private genreService: GenresService,
    private platformService: PlatformService,
  ) { }

  ngOnInit() {
    console.log();
    this.getGenres();
    this.getPlatforms();
  }

  filterByAlphabet(){
    this.sortByAlphabet = true;
    this.sortByReleaseDate = false;
    this.emitOrderAlphabetically();
  }
  filterByReleaseDate(){
    this.sortByReleaseDate = true
    this.sortByAlphabet = false;
    this.emitOrderByReleaseDate();

  }
  emitOrderAlphabetically() {
    this.orderParameter.emit('alphabet');
  }
  emitOrderByReleaseDate() {
    this.orderParameter.emit('release_date');
  }
  getPlatforms(){
    this.platformService.getPlatforms().subscribe({
      next: (response: any) => {
        this.platforms = response;
        console.log("Platforms:", this.platforms);
      },
      error: (err) => {
        console.error('Error loading platforms', err);
      },
    });
  }
  getGenres(){
    this.genreService.getGenres().subscribe({
      next: (response: any) => {
        this.genres = response;
        console.log("genres:", this.genres);
      },
      error: (err) => {
        console.error('Error loading genres', err);
      },
    });
  }

  emitFilterParams(){
    this.filterParameter.emit(this.selectedFilterParams);

  }
}


