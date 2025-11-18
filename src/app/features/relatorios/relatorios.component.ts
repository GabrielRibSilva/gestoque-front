import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendaService } from '../../core/services/venda.service';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CalendarModule, ButtonModule, CardModule],
  templateUrl: './relatorios.component.html'
})
export class RelatoriosComponent {
  private vendaService = inject(VendaService);
  
  filtros: any = { dataInicio: null, dataFim: null };
  dados: any = null;

  buscar() {
    const params: any = {};
    if(this.filtros.dataInicio) params.dataInicio = this.filtros.dataInicio.toISOString().split('T')[0];
    if(this.filtros.dataFim) params.dataFim = this.filtros.dataFim.toISOString().split('T')[0];

    this.vendaService.getRelatorio(params).subscribe(res => this.dados = res);
  }
}