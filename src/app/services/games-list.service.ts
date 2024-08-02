import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Game } from '../models/game';
import { UserGamingList } from '../models/userGamingList';

@Injectable({
  providedIn: 'root'
})
export class GamesListService {
  API_URL = 'http://localhost:3000'
  
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

  /* Gaming Lists */
  getUserGamesList(listType: string, ): Observable<Array<Game>> {
    return this.http.get<Array<Game>>(`${this.API_URL}/${listType}`);
  }
  getUserGamesListByUserId(userId: string, listType: string|undefined): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${listType}`, {
      params: { userId }
    }).pipe(
      catchError(error => {
        console.error('Error fetching user games list:', error);
        return throwError(error);
      })
    );
  }
  postGameToList(userGamingList: UserGamingList, listType: string): Observable<UserGamingList> {
    return this.http.post<UserGamingList>(`${this.API_URL}/${listType}`, userGamingList).pipe(
      catchError(error => {
        console.error('Error updating user gaming list:', error);
        return throwError(error);
      })
    );
  }
  putGameToList(userGamingList: UserGamingList, listType: string): Observable<UserGamingList> {
    return this.http.put<UserGamingList>(`${this.API_URL}/${listType}/${userGamingList.id}`, userGamingList).pipe(
      catchError(error => {
        console.error('Error updating user gaming list:', error);
        return throwError(error);
      })
    );
  }
  removeGameFromList(gameId: string, listType: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${listType}/${gameId}`).pipe(
      catchError(error => {
        console.error('Error removing game:', error);
        return throwError(error);
      })
    );
  }

  async findGameList(gameId: string, userId: string): Promise<string> {
    const listTypes = [
      'usersListPlayLater',
      'usersListCurrentlyPlaying',
      'usersListPlayed',
      'usersListCompleted'
    ];

    for (const listType of listTypes) {
      const response = await this.getUserGamesListByUserId(userId, listType).toPromise();
      if (response.games.some((game: any) => game.gameId === gameId)) {
        return listType.split('/').pop() || 'Not found';
      }
    }

    return 'Not found';
  }

  async removeGameFromAllLists(gameId: string, userId: string): Promise<void> {
    const listTypes = [
      'usersListPlayLater',
      'usersListCurrentlyPlaying',
      'usersListPlayed',
      'usersListCompleted'
    ];

    // Fetch and update the record for each list
    await Promise.all(listTypes.map(listType =>
      this.updateRecordRemovingGame(gameId, userId, listType)
    ));
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
}
