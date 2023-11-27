import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth-service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthInterceptor } from '../core/interceptors/auth.interceptor';
import { LocalStorageService } from '../core/services/local-storage-service/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  
  loginForm = new FormGroup( {
    email: new FormControl( '', [Validators.email, Validators.required] ),
    password: new FormControl( '', [Validators.required, Validators.minLength( 8 )] ),
  } );

  constructor(private authService: AuthService, private router: Router, private localStorage: LocalStorageService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    if ( this.activatedRoute.snapshot.queryParams['email'] ) { this.loginForm.controls.email.setValue(this.activatedRoute.snapshot.queryParams['email']) }
  }

  onSubmit() {
    if ( this.loginForm.invalid ) return
    let login = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    }
    this.authService.postLogin( login ).subscribe(
      {
        next: ( n ) => { console.log( n ); AuthInterceptor.accessToken = n?.token; this.localStorage.set('token', n?.token); this.router.navigateByUrl('/welcome'); },
        error: ( e ) => { console.log( e ); },
      }
    )
  }
}
