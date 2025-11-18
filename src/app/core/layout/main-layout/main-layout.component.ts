import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PerfilUsuario, Sessao } from '../../models/auth.model';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar'; 
import { AvatarModule } from 'primeng/avatar'; 

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToolbarModule,
    ButtonModule,
    MenuModule,
    SidebarModule,
    AvatarModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  public sessao: Sessao | null = null;
  
  public sidebarItems: MenuItem[] = [];
  
  public userMenuItems: MenuItem[] = [];

  public sidebarVisible = true; 

  ngOnInit(): void {
    this.sessao = this.authService.getSessao();
    this.construirMenuLateral();
    this.construirMenuUsuario();
  }

  private construirMenuLateral(): void {
    const perfil = this.sessao?.perfil;

    this.sidebarItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/dashboard']
      }
    ];

    if (perfil === PerfilUsuario.ADMIN) {
      this.sidebarItems.push(
        {
          label: 'Administração',
          items: [
            { label: 'Usuários', icon: 'pi pi-users', routerLink: ['/usuarios'] },
            { label: 'Produtos', icon: 'pi pi-box', routerLink: ['/produtos'] },
            { label: 'Estoque (Entrada/Ajuste)', icon: 'pi pi-arrow-right-arrow-left', routerLink: ['/estoque'] }
          ]
        },
        {
          label: 'Relatórios',
          items: [
            { label: 'Vendas', icon: 'pi pi-chart-line', routerLink: ['/relatorios'] }
          ]
        }
      );
    }

    if (perfil === PerfilUsuario.OPERADOR) {
      this.sidebarItems.push(
        {
          label: 'Operação',
          items: [
            { label: 'Caixa / Venda', icon: 'pi pi-shopping-cart', routerLink: ['/vendas'] }
          ]
        },
        {
          label: 'Relatórios',
          items: [
            { label: 'Minhas Vendas', icon: 'pi pi-list', routerLink: ['/relatorios'] }
          ]
        }
      );
    }
  }

  private construirMenuUsuario(): void {
    this.userMenuItems = [
      {
        label: 'Sair',
        icon: 'pi pi-power-off',
        command: () => this.logout()
      }
    ];
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}