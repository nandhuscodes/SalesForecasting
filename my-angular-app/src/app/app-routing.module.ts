import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DefaultComponent } from './default/default.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { GraphComponent } from './graph/graph.component';

const routes: Routes = [
  {path:'',component:LandingComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard', component:DashboardComponent},
  {path: 'register', component:SignupComponent},
  {path:'graph', component:GraphComponent},
  {path:"**",component:DefaultComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
