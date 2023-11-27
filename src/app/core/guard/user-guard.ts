import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { UserService } from '../services/user-service/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router){};
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):any {
    this.userService.getUser().subscribe({
      next: (u) => { 
        if (u){
          return true
        }
        this.router.navigateByUrl('/home')
        return false
       },
      error: (e) => {
        this.router.navigateByUrl('/home')
        return false
      },
    });
  }
}