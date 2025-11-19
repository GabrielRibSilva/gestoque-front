import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:8080/api'; 
  private usuarioLogado: any = null;
  private readonly CHAVE_SESSAO = 'gestoque_sessao';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.carregarSessao();
  }

  login(credenciais: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credenciais).pipe(
    tap(response => {
    this.usuarioLogado = {
      id: response.id,
      nome: response.nome || response.nomeCompleto, 
      email: credenciais.email,
      perfil: response.perfil || response.role
    };
    this.salvarSessaoLocal();
  })
);
  }

  isLoggedIn(): boolean {
    return !!this.usuarioLogado;
  }

  getPerfilUsuario(): string {
    return this.usuarioLogado ? this.usuarioLogado.perfil : '';
  }

  logout() {
    this.usuarioLogado = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.CHAVE_SESSAO);
    }
    this.router.navigate(['/login']);
  }

  getSessao() {
    return this.usuarioLogado;
  }

  private salvarSessaoLocal() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.CHAVE_SESSAO, JSON.stringify(this.usuarioLogado));
    }
  }

  private carregarSessao() {
    if (isPlatformBrowser(this.platformId)) {
      const sessaoSalva = localStorage.getItem(this.CHAVE_SESSAO);
      if (sessaoSalva) {
        this.usuarioLogado = JSON.parse(sessaoSalva);
      }
    }
  }
}