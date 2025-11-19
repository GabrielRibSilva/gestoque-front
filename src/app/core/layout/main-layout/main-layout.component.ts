import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';

import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    MenuModule,
    ButtonModule,
    AvatarModule,
    TagModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'] 
})
export class MainLayoutComponent {
  sessao: any;
  sidebarItems: any[] = [];
  userMenuItems: any[] = [];

  constructor(private auth: AuthService, private router: Router) {
    this.sessao = this.auth.getSessao();
    console.log('DEBUG PERFIL:', this.sessao?.perfil); 
    this.configurarMenu();
  }

  configurarMenu() {
    this.userMenuItems = [
      { label: 'Sair', icon: 'pi pi-power-off', command: () => this.logout() }
    ];

    this.sidebarItems = [
      { label: 'Home', icon: 'pi pi-home', routerLink: ['/'] }
    ];

    if (this.sessao?.perfil === 'ADMIN') {
      this.sidebarItems.push(
        { label: 'Usuários', icon: 'pi pi-users', routerLink: ['/admin/usuarios'] },
        { label: 'Produtos', icon: 'pi pi-box', routerLink: ['/admin/produtos'] },
        { label: 'Estoque', icon: 'pi pi-arrow-right-arrow-left', routerLink: ['/admin/estoque'] }
      );
    } else {
      this.sidebarItems.push(
        { label: 'Caixa / Venda', icon: 'pi pi-shopping-cart', routerLink: ['/operador/caixa'] }
      );
    }

    this.sidebarItems.push({ label: 'Relatórios', icon: 'pi pi-chart-bar', routerLink: ['/relatorios'] });
  }

  logout() {
    this.auth.logout();
  }
}