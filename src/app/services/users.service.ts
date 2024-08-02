import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  API_URL = 'http://localhost:3000'
  
  constructor(private http: HttpClient) { }

  getUsers(): Observable<Array<User>>{
    return this.http.get<Array<User>>(`${this.API_URL}/users`)
  }
  getUsersById(userId:string): Observable<any>{
    return this.http.get<any>(`${this.API_URL}/users/${userId}`)
  }
  getUsersByName(userName: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/users`, {
      params: { userName }
    });
  }
  getUsersPaginate(page:number, perPage:number): Observable<any>{
    return this.http.get<any>(`${this.API_URL}/users?_page=${page}&_per_page${perPage}`)
  }
  createUser(user: User): Observable<User> {
    localStorage.removeItem('user');

    return this.checkUserExists(user.name, user.email).pipe(
      switchMap(exists => {
        if (exists) {
          return throwError(new Error('User with the same name or email already exists.'));
        } else {
          return this.http.post<User>(`${this.API_URL}/users`, user).pipe(
            tap(createdUser => {
              localStorage.setItem('user', JSON.stringify({ id: createdUser.id, name: createdUser.name, avatar: createdUser.avatar }));
            })
          );
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  
  editUser( userId:string, user:any,): Observable<any>{
    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name, avatar: user.avatar }));

    return this.http.put<any>(`${this.API_URL}/users/${userId}`, user)
  }
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/users/${userId}`);
  }
  private checkUserExists(name: string, email: string): Observable<boolean> {
    return this.getUsers().pipe(
      map(users => users.some(user => user.name === name || user.email === email))
    );
  }
}
