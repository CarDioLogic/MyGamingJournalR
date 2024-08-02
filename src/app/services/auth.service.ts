import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsersService } from './users.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient,
    private usersService: UsersService
  ) {
  }
  
  login(username: string, password: string): Observable<any> {
    localStorage.removeItem('user');
    return this.http.get<any[]>(`${this.API_URL}/users/?name=${username}&password=${password}`).pipe(
      tap(users => {
        if (users.length > 0) {
          const user = users[0];
          localStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name, avatar: user.avatar }));
        } else {
          localStorage.removeItem('user');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    let isAuth = !!localStorage.getItem('user');
    return isAuth;
  }
  getLoggedInUser(): any {
    const userJson = localStorage.getItem('user');
    console.log('Logged in User:', userJson);
    return userJson ? JSON.parse(userJson) : null;
  }

}
