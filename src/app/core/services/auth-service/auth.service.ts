import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private readonly URL:string = environment.Url;

  postLogin(user: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/login`, user);
  }

  postLogout(): Observable<any> {
    return this.http.post<any>(`${this.URL}/logout`, null);
  }
}
