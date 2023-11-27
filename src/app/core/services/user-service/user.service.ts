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

  putUser( user: any ): Observable<any> {
    return this.http.put<any>( `${this.URL}/user/`+ user.id, user );
  }

  deleteUser( ): Observable<any> {
    return this.http.delete<any>( `${this.URL}/user`);
  }

  getUser(): Observable<any> {
    return this.http.get<any>( `${this.URL}/user` ).pipe(
      tap( response => { console.log(response); this.user = response; this.userSubject.next( response ); } )
    )
  }
}
