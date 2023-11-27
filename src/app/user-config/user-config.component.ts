import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user-service/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthInterceptor } from '../core/interceptors/auth.interceptor';
import { LocalStorageService } from '../core/services/local-storage-service/local-storage.service';
import { AuthService } from '../core/services/auth-service/auth.service';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.css']
})
export class UserConfigComponent {
  user: any;
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private userService: UserService, private router: Router, private localStorageService: LocalStorageService, private authService: AuthService ) {
    userService.user$.subscribe( user => {
      this.user = user;
      this.loadForm(user);
    } );
  }

  loadForm(user: any){
    this.userForm.controls.name.setValue(user.name)
    this.userForm.controls.email.setValue(user.email) 
  }

  logoutAndDelete() {
    this.authService.postLogout().subscribe( {
      next: ( v ) => {
        this.user = null; this.localStorageService.set( 'token', '' );
        AuthInterceptor.accessToken = '';
        this.deleteAccount();
      },
      error: ( e ) => { console.log( e ) }
    } )
  }

  deleteAccount() {
    this.userService.deleteUser().subscribe(
      {
        next: ( n ) => { console.log( n ); this.userService.getUser().subscribe(); this.router.navigateByUrl('/'); alert("Usuário excluido com Sucesso!.");},
        error: ( e ) => { console.log( e ); },
      }
    )
  }

  onSubmit() {
    if ( this.userForm.invalid ) return
    let user = {
      name: this.userForm.controls.name.value,
      email: this.userForm.controls.email.value,
      id: this.user._id
    }
    
    this.userService.putUser(user).subscribe(
      {
        next: ( n ) => { console.log( n );  alert("Usuário alterado com sucesso!."); },
        error: ( e ) => { console.log( e ); },
      }
    )
  }
}
