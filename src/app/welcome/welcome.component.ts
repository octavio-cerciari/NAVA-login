import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user-service/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  user: any;
  constructor(private userService: UserService) {
    userService.user$.subscribe( user => {
      this.user = user;;
    } );
  }

}
