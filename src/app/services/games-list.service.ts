import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Game } from '../models/game';
import { UserGamingList } from '../models/userGamingList';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GamesListService {
  //global games in the MyGamingJournal database
  API_URL = environment.MyGamingJournalApiUrl;
  
  constructor(private http: HttpClient) { }

  getGames(): Observable<Array<Game>>{
    return this.http.get<Array<Game>>(`${this.API_URL}/gamesList`)
  }

  getGamesById(gameId:string): Observable<any>{
    return this.http.get<any>(`${this.API_URL}/gamesList/${gameId}`)
  }
  getGamesDetailedInfoById(gameId:string): Observable<any>{
    return this.http.get<any>(`${this.API_URL}/gameDetails/${gameId}`)
  }
  getGamesByTitle(title: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/gamesList`, {
      params: { title }
    });
  }
  getGamesPaginate(page: number, perPage: number, platform?: string, genre?:string, title?:string): Observable<any> {
    console.log(page, perPage);
    
    let url = `${this.API_URL}/gamesList?_page=${page}&_per_page=${perPage}`;
  
    if (platform) {
      url += `&platform=${platform}`;
    }
    if (genre) {
      url += `&genre=${genre}`;
    }
    if(title){
      url += `&title=${title}`;
    }

    return this.http.get<any>(url);
  }
  getGamesInRange(start:number, limit:number): Observable<any>{
    if (start < 0 || limit <= 0) {
      return throwError(new Error('Invalid range: start must be >= 0 and limit must be > 0'));
    }
    return this.http.get<any>(`${this.API_URL}/gamesList?_start=${start}&_limit=${limit}`).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
  createGame(game: Game): Observable<Game> {
    return this.http.post<Game>(`${this.API_URL}/gamesList`, game);
  }
  editGame(game:any, gameId:number): Observable<any>{
    return this.http.put<any>(`${this.API_URL}/gamesList/${gameId}`, game)
  }
  deletegame(gameId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/gamesList/${gameId}`);
  }



  postGameToList(userGamingList: UserGamingList, listType: string): Observable<UserGamingList> {
    return this.http.post<UserGamingList>(`${this.API_URL}/${listType}`, userGamingList).pipe(
      catchError(error => {
        console.error('Error updating user gaming list:', error);
        return throwError(error);
      })
    );
  }

  removeGameFromLists(gameId: string): Observable<any> {
    const userJson = sessionStorage.getItem('user');
    let headers = new HttpHeaders({
    });  

    if (userJson) {
      const user = JSON.parse(userJson);
      headers = headers.set('Authorization', `Bearer ${user.token}`);
    }

    return this.http.delete(`${this.API_URL}/deleteGameFromLists/${gameId}`, {headers}).pipe(
      catchError(error => {
        console.error('Error removing game:', error);
        return throwError(error);
      })
    );
  }




  private async updateRecordRemovingGame(gameId: string, userId: string, listType: string): Promise<void> {
    try {
      // Fetch the current record
      const listRecord = await this.http.get<any>(`${this.API_URL}/${listType}`, {
        params: { userId }
      }).toPromise();
      let record = listRecord[0];
      console.log("records", record)

      if (record && record.games) {
        // Filter out the game with the specified gameId
        const updatedGames = record.games.filter((game: any) => game.gameId !== gameId);

        // Update the record with the filtered games
        await this.http.put<any>(`${this.API_URL}/${listType}/${record.id}`, {
          ...record,
          games: updatedGames
        }).toPromise();
      }
    } catch {
      // Silently ignore any errors
    }
  }

  putGameToList(game:any, gamingListName:string){
    const userJson = sessionStorage.getItem('user');
    let headers = new HttpHeaders({
    });  

    if (userJson) {
      const user = JSON.parse(userJson);
      headers = headers.set('Authorization', `Bearer ${user.token}`);
    }

    return this.http.post<any>(`${this.API_URL}/${gamingListName}`, game, {headers})
  }
  getUserGamesList( gamingListName:string){
    const userJson = sessionStorage.getItem('user');
    let headers = new HttpHeaders({
    });  

    if (userJson) {
      const user = JSON.parse(userJson);
      headers = headers.set('Authorization', `Bearer ${user.token}`);
    }

    return this.http.get<any>(`${this.API_URL}/${gamingListName}`, {headers})
  }
}
