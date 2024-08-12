import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

//rawg is a third party api that gives access to a big videogame database
export class RawgService {
  API_URL = `https://api.rawg.io/api/`
  
  constructor(private http: HttpClient) { }

  getGamesPaginate(page: number, perPage: number, platform?: string, genre?:string, title?:string): Observable<any> {    
    let url = `${this.API_URL}games?key=${environment.rawgApiKey}&page=${page}&page_size=${perPage}`;
  
    if (platform) {
      url += `&platforms=${platform}`;
    }
    if (genre) {
      url += `&genres=${genre}`;
    }
    if(title){
      url += `&search=${title}`;
    }

    console.log('finalURL:', url)
    return this.http.get<any>(url);
  }

  getPlatforms(): Observable<any> {    
    let url = `${this.API_URL}platforms?key=${environment.rawgApiKey}`;
  
    return this.http.get<any>(url);
  }
  getGenres(): Observable<any> {    
    let url = `${this.API_URL}genres?key=${environment.rawgApiKey}`;
  
    return this.http.get<any>(url);
  }
  getGameById(id:string){
    let url = `https://api.rawg.io/api/games/${id}?key=${environment.rawgApiKey}`;

    return this.http.get<any>(url);
  }
  changePage(pageUrl:string){
    return this.http.get<any>(pageUrl);
  }
}
