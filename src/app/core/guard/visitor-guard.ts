import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { UserService } from '../services/user-service/user.service';


@Injectable({
  providedIn: 'root'
})
export class VisitorGuardService implements CanActivate {
  constructor(private userService: UserService, private router: Router){};
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):any {
      console.log("ENTROU VISITOR GUARD")
    this.userService.getUser().subscribe({
      next: (u) => { 
        if (u){
          console.log("GUARD FALSE")
          this.router.navigateByUrl('/home')
          return false
        }
        console.log("GUARD TRUE")
        return true
       },
      error: (e) => {
        console.log("GUARD TRUE")
        return true
      },
    });
  }
}