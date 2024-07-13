import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginModel } from 'src/app/models/login.model';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: UserModel ;

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService
  ) {

    var user = localStorage.getItem(environment.user);
    if (user)
    {
      this.user = JSON.parse(atob(user));
    }

   }

  ngOnInit(): void {
  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();
    this.authService.loggout();

    if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

}
