import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/core/interceptors/auth.interceptor';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage-service/local-storage.service';
import { UserService } from 'src/app/core/services/user-service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: any;
  constructor(private router: Router, private userService: UserService, private authService: AuthService, private localStorageService: LocalStorageService) {
    userService.user$.subscribe( user => {
      this.user = user;;
    } );
  }

  navigationByUrl(url: string) {
    this.router.navigateByUrl(url)
  }

  logout() {
    this.authService.postLogout().subscribe( {
      next: ( v ) => {
        this.user = null; this.localStorageService.set( 'token', '' );
        AuthInterceptor.accessToken = '';
        this.router.navigateByUrl( '/' )
        alert("Obrigado e volter sempre!.");
      },
      error: ( e ) => { console.log( e ) }
    } )
  }
}
