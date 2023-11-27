import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {
  private readonly URL: string = environment.Url;
  private userSubject = new Subject<any>();
  user$ = this.userSubject.asObservable();
  user: any = null;
  constructor( private http: HttpClient ) { }

  postSignup( user: any ): Observable<any> {
    return this.http.post<any>( `${this.URL}/user`, user );
  }

  getUser(): Observable<any> {
    return this.http.get<any>( `${this.URL}/api/user` ).pipe(
      tap( response => { this.user = response.dados; this.userSubject.next( response.dados ); } )
    )
  }
}
