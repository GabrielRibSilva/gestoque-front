import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProdutoRequest, ProdutoResponse } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/produtos';

  listar(): Observable<ProdutoResponse[]> {
    return this.http.get<ProdutoResponse[]>(this.API_URL);
  }

  criar(produto: ProdutoRequest): Observable<ProdutoResponse> {
    return this.http.post<ProdutoResponse>(this.API_URL, produto);
  }

  atualizar(id: number, produto: ProdutoRequest): Observable<ProdutoResponse> {
    return this.http.put<ProdutoResponse>(${this.API_URL}/${id}, produto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(${this.API_URL}/${id});
  }
}