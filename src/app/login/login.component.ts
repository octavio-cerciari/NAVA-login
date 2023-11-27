import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  
  loginForm = new FormGroup( {
    email: new FormControl( '', [Validators.email, Validators.required] ),
    password: new FormControl( '', [Validators.required, Validators.minLength( 8 )] ),
  } );

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if ( this.loginForm.invalid ) return
    let login = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    }
    this.authService.postLogin( login ).subscribe(
      {
        next: ( n ) => { console.log( n ); this.router.navigateByUrl('/welcome')},
        error: ( e ) => { console.log( e ); },
      }
    )
  }
}
