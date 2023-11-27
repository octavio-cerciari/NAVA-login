import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static accessToken = ''
  private readonly URL: string = environment.Url;
  constructor() { }

  intercept( request: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {

    console.log("ENTROU INTERCEPTOR")
    let headers = new HttpHeaders( {
      'Content-Type': 'application/json',
      'Authorization': AuthInterceptor.accessToken
    } );
    const req = request.clone( { headers: headers } );
    return next.handle( req );
  }
}
