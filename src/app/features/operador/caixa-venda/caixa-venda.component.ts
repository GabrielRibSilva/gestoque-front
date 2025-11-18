import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../../core/services/produto.service';
import { VendaService } from '../../../core/services/venda.service';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-caixa-venda',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, InputNumberModule, ButtonModule, TableModule, CardModule],
  templateUrl: './caixa-venda.component.html'
})
export class CaixaVendaComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private vendaService = inject(VendaService);
  private authService = inject(AuthService);
  private msg = inject(MessageService);

  produtosDisponiveis: any[] = [];
  produtoSelecionado: any = null;
  quantidade: number = 1;
  
  carrinho: any[] = [];
  valorRecebido: number | null = null;

  ngOnInit() { this.carregarProdutos(); }

  carregarProdutos() {
    this.produtoService.listar().subscribe(data => {
      this.produtosDisponiveis = data.filter(p => p.quantidadeEstoque > 0)
        .map(p => ({...p, label: ${p.nome} (R$ ${p.precoUnitario})}));
    });
  }

  adicionarAoCarrinho() {
    if (!this.produtoSelecionado || this.quantidade <= 0) return;
    
    if (this.quantidade > this.produtoSelecionado.quantidadeEstoque) {
      this.msg.add({severity:'warn', summary:'Estoque insuficiente', detail:Disponível: ${this.produtoSelecionado.quantidadeEstoque}});
      return;
    }

    const item = {
      produtoId: this.produtoSelecionado.id,
      nome: this.produtoSelecionado.nome,
      preco: this.produtoSelecionado.precoUnitario,
      quantidade: this.quantidade,
      subtotal: this.quantidade * this.produtoSelecionado.precoUnitario
    };

    this.carrinho.push(item);
    this.produtoSelecionado.quantidadeEstoque -= this.quantidade; // Baixa visual temporária
    this.produtoSelecionado = null;
    this.quantidade = 1;
  }

  get totalVenda(): number {
    return this.carrinho.reduce((acc, item) => acc + item.subtotal, 0);
  }

  get troco(): number {
    return (this.valorRecebido || 0) - this.totalVenda;
  }

  finalizarVenda() {
    if (this.carrinho.length === 0) return;
    if (!this.valorRecebido || this.valorRecebido < this.totalVenda) {
      this.msg.add({severity:'error', summary:'Erro', detail:'Valor recebido insuficiente'});
      return;
    }

    const sessao = this.authService.getSessao();
    const payload = {
      usuarioResponsavelId: sessao?.id || 0,
      valorRecebido: this.valorRecebido,
      itens: this.carrinho.map(i => ({ produtoId: i.produtoId, quantidade: i.quantidade }))
    };

    this.vendaService.registrar(payload).subscribe({
      next: () => {
        this.msg.add({severity:'success', summary:'Venda Realizada', detail:Troco: R$ ${this.troco.toFixed(2)}});
        this.carrinho = [];
        this.valorRecebido = null;
        this.carregarProdutos();
      },
      error: (e) => this.msg.add({severity:'error', summary:'Erro', detail: e.error})
    });
  }
}