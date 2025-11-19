import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  codigoProduto?: string; 
  nome: string;
  categoria?: string;
  quantidadeEstoque: number;
  precoUnitario: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private API_URL = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API_URL);
  }

  salvar(produto: Produto): Observable<Produto> {
    if (produto.id) {
      return this.atualizar(produto.id, produto);
    }
    return this.criar(produto);
  }

  criar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API_URL, produto);
  }

  atualizar(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.API_URL}/${id}`, produto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}