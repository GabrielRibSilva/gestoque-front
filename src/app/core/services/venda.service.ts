import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private API_URL = 'http://localhost:8080/api/vendas';

  constructor(private http: HttpClient) {}

  registrar(venda: any): Observable<any> {
    return this.http.post<any>(this.API_URL, venda);
  }

  listarVendas(filtros?: any): Observable<any[]> {
    let params = new HttpParams();

    if (filtros) {
      if (filtros.inicio) {
        params = params.set('dataInicio', new Date(filtros.inicio).toISOString());
      }
      
      if (filtros.fim) {
        params = params.set('dataFim', new Date(filtros.fim).toISOString());
      }
    }

    return this.http.get<any[]>(this.API_URL, { params });
  }
}