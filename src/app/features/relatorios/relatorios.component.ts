import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VendaService } from '../../core/services/venda.service';

import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    CalendarModule,
    ButtonModule,
    TableModule,
    ToastModule
  ],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css'],
  providers: [MessageService]
})
export class RelatoriosComponent implements OnInit {
  filtros = {
    dataInicio: null,
    dataFim: null
  };

  dados: any = null;

  constructor(
    private vendaService: VendaService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.buscar();
  }

  buscar() {
    const params: any = {};
    if (this.filtros.dataInicio) params.inicio = this.filtros.dataInicio;
    if (this.filtros.dataFim) params.fim = this.filtros.dataFim;

    this.vendaService.listarVendas(params).subscribe({
      next: (listaVendas) => {
        
        const totalValor = listaVendas.reduce((acc, v) => acc + v.valorTotal, 0);
        
        this.dados = {
          totalDeVendas: listaVendas.length,
          valorTotalVendido: totalValor,
          vendas: listaVendas.map(v => ({
            ...v,
            nomeUsuarioResponsavel: v.nomeUsuario || v.usuario?.nome || 'Desconhecido'
          }))
        };
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar o relatório.' });
      }
    });
  }
}