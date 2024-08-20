import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  
  getUser(userId: string) {
    const userJson = sessionStorage.getItem('user');
    let headers = new HttpHeaders();
  
    if (userJson) {
      const user = JSON.parse(userJson);
      headers = new HttpHeaders({
        'Authorization': `Bearer ${user.token}`
      });
    }
  
    return this.http.get<any>(`${this.API_URL}/getUser/${userId}`, { headers });
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
    const userJson = sessionStorage.getItem('user');
    let headers = new HttpHeaders();
    sessionStorage.removeItem('user');

    if (userJson) {
      const user = JSON.parse(userJson);
      headers = headers.set('Authorization', `Bearer ${user.token}`);
    }
  
    return this.http.post<any>(`${this.API_URL}/logout`, {}, { headers })
      .subscribe({
        next: () => {
        },
        error: (err) => {
          console.error('Logout failed', err);
        },
        complete: () => {
        }
      });
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

  updateUser(userId: string, formData: FormData): Observable<any> {
    console.log(this.API_URL);
  
    const userJson = sessionStorage.getItem('user');
    let headers = new HttpHeaders();
  
    if (userJson) {
      const user = JSON.parse(userJson);
      headers = headers.set('Authorization', `Bearer ${user.token}`);
    }
  
    //laravel put requests not able to receive files, only post
    return this.http.post<any>(`${this.API_URL}/updateUser/${userId}`, formData, {headers}).pipe(
      map(response => {
        const updatedUser = {
          token: response.data.token,
          name: response.data.user.name,
          id: response.data.user.id,
          email: response.data.user.email,
          profile_image: this.API_URL + response.data.user.profile_image
        };
  
        sessionStorage.removeItem('user');
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
  
        console.log("UPDATE USER AQUI",response);
        return response;
      }),
    );
  }

  deleteUser(userId:string){
    const userJson = sessionStorage.getItem('user');
    let headers = new HttpHeaders();
  
    if (userJson) {
      const user = JSON.parse(userJson);
      headers = headers.set('Authorization', `Bearer ${user.token}`);
    }

    return this.http.delete<any>(`${this.API_URL}/deleteUser/${userId}`, {headers})
  }
}
