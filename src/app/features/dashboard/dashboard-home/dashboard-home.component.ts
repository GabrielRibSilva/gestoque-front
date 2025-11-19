import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  templateUrl: './dashboard-home.component.html',
  styles: [`
    
    .dashboard-container {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .welcome-card {
        background-color: #fff;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        border: 1px solid #e5e7eb;
    }

    .shortcuts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
        gap: 1.5rem;
    }

    .shortcut-card {
        background-color: #fff;
        padding: 1.5rem;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .shortcut-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        border-color: #3B82F6;
    }

    .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .icon-box {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }

    .bg-blue { background-color: #dbeafe; color: #2563eb; }
    .bg-orange { background-color: #ffedd5; color: #ea580c; }
    .bg-cyan { background-color: #cffafe; color: #0891b2; }
    .bg-green { background-color: #dcfce7; color: #16a34a; }
    .bg-purple { background-color: #f3e8ff; color: #9333ea; }

    h3 { margin: 0 0 0.5rem 0; font-size: 1.25rem; color: #1f2937; }
    p { margin: 0; color: #6b7280; }
  `]
})
export class DashboardHomeComponent {
  nomeUsuario: string = '';
  perfil: string = '';
  isAdmin: boolean = false;

  constructor(private auth: AuthService) {
    const sessao = this.auth.getSessao();
    if (sessao) {
      this.nomeUsuario = sessao.nome;
      this.perfil = sessao.perfil;
      this.isAdmin = sessao.perfil === 'ADMIN';
    }
  }
}