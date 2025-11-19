import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { ProdutoService } from '../../../core/services/produto.service';
import { VendaService } from '../../../core/services/venda.service';
import { AuthService } from '../../../core/services/auth.service';

import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-caixa-venda',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, DropdownModule,
    InputNumberModule, ButtonModule, TableModule, ToastModule, DividerModule
  ],
  templateUrl: './caixa-venda.component.html',
  providers: [MessageService]
})
export class CaixaVendaComponent implements OnInit {
  produtosDisponiveis: any[] = [];
  produtoSelecionado: any;
  quantidade: number = 1;
  
  carrinho: any[] = [];
  valorRecebido: number | null = null;
  
  totalVenda: number = 0;
  troco: number = 0;

  constructor(
    private produtoService: ProdutoService,
    private vendaService: VendaService,
    private authService: AuthService,
    private msg: MessageService
  ) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService.listar().subscribe({
      next: (data) => {
        this.produtosDisponiveis = data
          .filter(p => p.quantidadeEstoque > 0)
          .map(p => ({
            label: `${p.nome} - R$ ${p.precoUnitario.toFixed(2)} (Disp: ${p.quantidadeEstoque})`,
            value: p
          }));
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar produtos.' })
    });
  }

  adicionarAoCarrinho() {
    if (!this.produtoSelecionado || this.quantidade <= 0) return;

    const prod = this.produtoSelecionado;

    if (this.quantidade > prod.quantidadeEstoque) {
      this.msg.add({ severity: 'warn', summary: 'Estoque Insuficiente', detail: `Apenas ${prod.quantidadeEstoque} unidades disponíveis.` });
      return;
    }

    const item = {
      produtoId: prod.id,
      nome: prod.nome,
      precoUnitario: prod.precoUnitario,
      quantidade: this.quantidade,
      subtotal: prod.precoUnitario * this.quantidade
    };

    this.carrinho.push(item);
    
    prod.quantidadeEstoque -= this.quantidade;
    
    this.calcularTotais();
    
    this.produtoSelecionado = null;
    this.quantidade = 1;
  }

  removerDoCarrinho(index: number) {
    this.carrinho.splice(index, 1);
    this.calcularTotais();
  }

  calcularTotais() {
    this.totalVenda = this.carrinho.reduce((acc, item) => acc + item.subtotal, 0);
    
    if (this.valorRecebido && this.valorRecebido >= this.totalVenda) {
      this.troco = this.valorRecebido - this.totalVenda;
    } else {
      this.troco = 0;
    }
  }

  atualizarTroco() {
    this.calcularTotais();
  }

  finalizarVenda() {
    if (this.carrinho.length === 0) return;
    
    if (!this.valorRecebido || this.valorRecebido < this.totalVenda) {
      this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Valor recebido é menor que o total.' });
      return;
    }

    const sessao = this.authService.getSessao();
    
    const vendaDTO = {
      usuarioResponsavelId: sessao ? sessao.id : 1, 
      valorTotal: this.totalVenda,
      valorRecebido: this.valorRecebido,
      itens: this.carrinho.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario 
      }))
    };

    console.log('Enviando Venda:', vendaDTO);

    this.vendaService.registrar(vendaDTO).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Venda Concluída', detail: `Troco: R$ ${this.troco.toFixed(2)}` });
        this.limparTela();
        this.carregarProdutos(); 
      },
      error: (err) => {
        console.error(err);
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao registrar venda.' });
      }
    });
  }

  limparTela() {
    this.carrinho = [];
    this.valorRecebido = null;
    this.totalVenda = 0;
    this.troco = 0;
    this.produtoSelecionado = null;
  }
}