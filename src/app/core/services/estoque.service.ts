import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MovimentacaoRequest {
  produtoId: number;
  tipo: 'ENTRADA' | 'AJUSTE' | 'SAIDA';
  quantidade: number;
  observacao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private API_URL = 'http://localhost:8080/api/estoque';

  constructor(private http: HttpClient) {}

  movimentar(req: MovimentacaoRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/movimentar`, req);
  }
}