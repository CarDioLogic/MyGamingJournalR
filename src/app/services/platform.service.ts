import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Platform } from '../models/platform';
@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  API_URL = 'http://localhost:3000'
  
  constructor(private http: HttpClient) { }

  getPlatforms(): Observable<Array<Platform>>{
    return this.http.get<Array<Platform>>(`${this.API_URL}/platform`)
  }
  getPlatformsById(PlatformId:number): Observable<any>{
    return this.http.get<any>(`${this.API_URL}/platform/${PlatformId}`)
  }
  getPlatformsPaginate(page:number, perPage:number): Observable<any>{
    console.log(page, perPage)
    return this.http.get<any>(`${this.API_URL}/platform?_page=${page}&_per_page${perPage}`)
  }
  createPlatform(Platform: Platform): Observable<Platform> {
    return this.http.post<Platform>(`${this.API_URL}/platform`, Platform);
  }
  editPlatform(Platform:any, PlatformId:number): Observable<any>{
    return this.http.put<any>(`${this.API_URL}/platform/${PlatformId}`, Platform)
  }
  deletePlatform(PlatformId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/platform/${PlatformId}`);
  }
}
