import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Sessao } from '../../models/auth.model';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    ToolbarModule,
    ButtonModule,
    MenuModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  public sessao: Sessao | null = null;
  public menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.sessao = this.authService.getSessao();

    this.menuItems = [
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}