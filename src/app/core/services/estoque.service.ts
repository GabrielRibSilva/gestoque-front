import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovimentacaoRequest } from '../models/estoque.model';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/estoque';

  movimentar(req: MovimentacaoRequest) {
    return this.http.post(${this.API_URL}/movimentar, req);
  }
}