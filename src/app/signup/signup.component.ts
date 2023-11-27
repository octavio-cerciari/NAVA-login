import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../core/services/user-service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(private userService: UserService, private router: Router ) {}

  onSubmit() {
    if ( this.signupForm.invalid ) return
    let signup = {
      name: this.signupForm.controls.name.value,
      email: this.signupForm.controls.email.value,
      password: this.signupForm.controls.password.value,
    }
    this.userService.postSignup(signup).subscribe(
      {
        next: ( n ) => { console.log( n ); this.router.navigateByUrl('/login?email='+this.signupForm.controls.email.value); alert("Usuário registrado com Sucesso!.");},
        error: ( e ) => { console.log( e ); alert(e.error?.error);},
      }
    )
  }
}
