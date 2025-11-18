import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard'; 
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home/dashboard-home.component';
import { PerfilUsuario } from './core/models/auth.model';
import { ProdutoListComponent } from './features/admin/produto-list/produto-list.component';
import { EstoqueMovimentacaoComponent } from './features/admin/estoque-movimentacao/estoque-movimentacao.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardHomeComponent },
      
      {
        path: 'usuarios',
        loadComponent: () => import('./features/admin/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
        canActivate: [roleGuard],
        data: { role: PerfilUsuario.ADMIN }
      },
      {
        path: 'produtos',
        loadComponent: () => import('./features/dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent), 
        canActivate: [roleGuard],
        data: { role: PerfilUsuario.ADMIN }
      },
      {
        path: 'estoque',
        loadComponent: () => import('./features/dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent), 
        canActivate: [roleGuard],
        data: { role: PerfilUsuario.ADMIN }
      },


      {
        path: 'vendas',
        loadComponent: () => import('./features/dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent),
        canActivate: [roleGuard],
        data: { role: PerfilUsuario.OPERADOR }
      },

      {
        path: 'relatorios',
        loadComponent: () => import('./features/dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      
      {
        path: 'produtos',
        // Use o componente real agora
        loadComponent: () => import('./features/admin/produto-list/produto-list.component').then(m => m.ProdutoListComponent),
        canActivate: [roleGuard],
        data: { role: PerfilUsuario.ADMIN }
      },
      
      {
        path: 'estoque',
        loadComponent: () => import('./features/admin/estoque-movimentacao/estoque-movimentacao.component').then(m => m.EstoqueMovimentacaoComponent),
      }

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];