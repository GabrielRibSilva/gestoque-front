import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { ProdutoListComponent } from './features/admin/produto-list/produto-list.component';
import { EstoqueMovimentacaoComponent } from './features/admin/estoque-movimentacao/estoque-movimentacao.component';
import { CaixaVendaComponent } from './features/operador/caixa-venda/caixa-venda.component';
import { UsuarioListComponent } from './features/admin/usuario-list/usuario-list.component';
import { RelatoriosComponent } from './features/relatorios/relatorios.component';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home/dashboard-home.component'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      
      { 
        path: 'admin/usuarios', 
        component: UsuarioListComponent,
        canActivate: [roleGuard],
        data: { role: 'ADMIN' } 
      },
      { 
        path: 'admin/produtos', 
        component: ProdutoListComponent,
        canActivate: [roleGuard],
        data: { role: 'ADMIN' }
      },
      { 
        path: 'admin/estoque', 
        component: EstoqueMovimentacaoComponent,
        canActivate: [roleGuard],
        data: { role: 'ADMIN' }
      },

      { 
        path: 'operador/caixa', 
        component: CaixaVendaComponent,
      },

      { path: 'relatorios', component: RelatoriosComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];