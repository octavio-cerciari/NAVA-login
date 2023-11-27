import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuardService } from './core/guard/user-guard';
import { UserConfigComponent } from './user-config/user-config.component';
import { VisitorGuardService } from './core/guard/visitor-guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [VisitorGuardService]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [VisitorGuardService]
  },
  {
    path: 'login/:email',
    component: LoginComponent,
    canActivate: [VisitorGuardService]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'user-config',
    component: UserConfigComponent,
    canActivate: [AuthGuardService]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
