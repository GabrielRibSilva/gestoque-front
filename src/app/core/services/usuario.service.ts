import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number;
  nomeCompleto: string;
  email: string;
  senha?: string;
  perfil: 'ADMIN' | 'OPERADOR';
  status?: 'ATIVO' | 'INATIVO';
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URL = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  salvar(usuario: Usuario): Observable<Usuario> {
    if (usuario.id) {
      return this.http.put<Usuario>(`${this.API_URL}/${usuario.id}`, usuario);
    }
    return this.http.post<Usuario>(this.API_URL, usuario);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}