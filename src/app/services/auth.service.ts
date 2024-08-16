import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsersService } from './users.service';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = environment.MyGamingJournalApiUrl;

  constructor(private http: HttpClient,
    private usersService: UsersService
  ) {
  }
  
  login(name: string, password: string): Observable<any> {
    sessionStorage.removeItem('user');
  
    const loginData = {
      name: name,
      password: password
    };
  
    return this.http.post<any>(`${this.API_URL}/login`, loginData).pipe(
      map(response => {
        const user = {
          token: response.data.token,
          name: response.data.user.name,
          id: response.data.user.id,
          email: response.data.user.email,
          profile_image: this.API_URL + response.data.user.profile_image

        };
  
        sessionStorage.setItem('user', JSON.stringify(user));
  
        console.log(response);
        return response;
      })
    );
  }

  logout() {
    sessionStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    let isAuth = !!sessionStorage.getItem('user');
    return isAuth;
  }
  getLoggedInUser(): any {
    const userJson = sessionStorage.getItem('user');
    console.log('Logged in User:', userJson);
    return userJson ? JSON.parse(userJson) : null;
  }

  createUser(formData: FormData): Observable<any> {
    console.log(this.API_URL);
    // Logging formData is not directly possible, but you can inspect the contents if needed
  
    return this.http.post<any>(`${this.API_URL}/register`, formData).pipe(
      map(response => {

        const user = {
      token: response.data.token,
      name: response.data.user.name,
      id: response.data.user.id,
      email: response.data.user.email,
      profile_image: this.API_URL + response.data.user.profile_image
    };
    sessionStorage.setItem('user', JSON.stringify(user));

        console.log(response);
        return response;
      }),
    );
  }
}
