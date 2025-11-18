import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VendaRequest } from '../models/venda.model';

@Injectable({ providedIn: 'root' })
export class VendaService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/vendas';

  registrar(venda: VendaRequest) {
    return this.http.post(this.API_URL, venda);
  }

  getRelatorio(params: any) {
    return this.http.get(http://localhost:8080/api/relatorios/vendas, { params });
  }
}