import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { Guardian } from './Guardian';
import { HomeComponent } from '../components/home/home.component';
import { ManagementComponent } from '../components/management/management.component';
import { QueryComponent } from '../components/query/query.component';
import { RestaurarClaveComponent } from '../components/restaurarClave/restaurarClave.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [Guardian] },
  { path: 'restaurar-clave', component: RestaurarClaveComponent },
  { path: 'query', component: QueryComponent, canActivate: [Guardian] },
  { path: 'management', component: ManagementComponent, canActivate: [Guardian] },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
