import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, Sessao } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  
  private readonly API_URL = 'http://localhost:8080/api';

  private static readonly SESSAO_KEY = 'gestoque_sessao';

  private sessaoSubject = new BehaviorSubject<Sessao | null>(this.getSessaoLocal());
  public sessao$ = this.sessaoSubject.asObservable();

  constructor() { }

  public login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.salvarSessaoLocal(response))
    );
  }

  private salvarSessaoLocal(sessao: Sessao): void {
    localStorage.setItem(AuthService.SESSAO_KEY, JSON.stringify(sessao));
    this.sessaoSubject.next(sessao);
  }

  public logout(): void {
    localStorage.removeItem(AuthService.SESSAO_KEY);
    this.sessaoSubject.next(null);
  }

  private getSessaoLocal(): Sessao | null {
    try {
      const sessaoJson = localStorage.getItem(AuthService.SESSAO_KEY);
      return sessaoJson ? JSON.parse(sessaoJson) : null;
    } catch (e) {
      localStorage.removeItem(AuthService.SESSAO_KEY);
      return null;
    }
  }

  public getSessao(): Sessao | null {
    return this.sessaoSubject.value;
  }

  public isLoggedIn(): boolean {
    return !!this.getSessao();
  }

  public getPerfilUsuario(): string | null {
    return this.getSessao()?.perfil ?? null;
  }
}