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
  API_URL = `https://api.rawg.io/api/games?key=${environment.rawgApiKey}`
  
  constructor(private http: HttpClient) { }

  getGamesPaginate(page: number, perPage: number, platform?: string, genre?:string, title?:string): Observable<any> {    
    let url = `${this.API_URL}&page=${page}&page_size=${perPage}`;
  
    if (platform) {
      url += `&platforms=${platform}`;
    }
    if (genre) {
      url += `&genres=${genre}`;
    }
    if(title){
      url += `&search=${title}`;
    }

    return this.http.get<any>(url);
  }

  changePage(pageUrl:string){
    return this.http.get<any>(pageUrl);
  }
}
