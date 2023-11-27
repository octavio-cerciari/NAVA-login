import { Component, OnInit } from '@angular/core';
import { UserService } from './core/services/user-service/user.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { LocalStorageService } from './core/services/local-storage-service/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'nava-login';
  constructor(private userService: UserService, private localStorageService: LocalStorageService, private router: Router) {}
  ngOnInit(): void {
    let token = this.localStorageService.get( 'token' )
    if ( token ) {
      AuthInterceptor.accessToken = token;
      this.userService.getUser().subscribe(
        {
          next: ( n ) => { console.log( n ); },
          error: ( e ) => { console.log( e ); if (!e.error.auth) { AuthInterceptor.accessToken = ''; this.localStorageService.set('token', '');  this.navigationByUrl('/login'); }},
        }
      )
    }
  }

  navigationByUrl(url: string) {
    this.router.navigateByUrl(url)
  }
}
