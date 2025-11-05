import { Component } from '@angular/core';
import { Router,RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { User } from './models/auth.model';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

@Component({
  selector: 'app-root',
  imports: [CommonModule,MaterialModule,RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  
  currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    console.log('AppComponent loaded');
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}