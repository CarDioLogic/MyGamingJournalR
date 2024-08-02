import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Genre } from '../models/genre';

@Injectable({
  providedIn: 'root'
})
export class GenresService {
  API_URL = 'http://localhost:3000'
  
  constructor(private http: HttpClient) { }

  getGenres(): Observable<Array<Genre>>{
    return this.http.get<Array<Genre>>(`${this.API_URL}/genre`)
  }
  getGenresById(genreId:number): Observable<any>{
    return this.http.get<any>(`${this.API_URL}/genre/${genreId}`)
  }
  getGenresPaginate(page:number, perPage:number): Observable<any>{
    console.log(page, perPage)
    return this.http.get<any>(`${this.API_URL}/genre?_page=${page}&_per_page${perPage}`)
  }
  createGenre(genre: Genre): Observable<Genre> {
    return this.http.post<Genre>(`${this.API_URL}/genre`, genre);
  }
  editGenre(genre:any, genreId:number): Observable<any>{
    return this.http.put<any>(`${this.API_URL}/genre/${genreId}`, genre)
  }
  deleteGenre(genreId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/genre/${genreId}`);
  }
}
