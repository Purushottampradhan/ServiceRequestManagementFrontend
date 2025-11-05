import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: RequestListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
