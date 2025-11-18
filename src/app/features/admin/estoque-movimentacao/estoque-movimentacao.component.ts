import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EstoqueService } from '../../../core/services/estoque.service';
import { ProdutoService } from '../../../core/services/produto.service';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputNumberModule, InputTextareaModule, ButtonModule, CardModule],
  templateUrl: './estoque-movimentacao.component.html',
  styles: ['.field { margin-bottom: 1.5rem; }']
})
export class EstoqueMovimentacaoComponent implements OnInit {
  private estoqueService = inject(EstoqueService);
  private produtoService = inject(ProdutoService);
  private msg = inject(MessageService);
  private fb = inject(FormBuilder);

  form: FormGroup;
  produtos: any[] = [];
  tipos = [{label: 'Entrada (Reposição)', value: 'ENTRADA'}, {label: 'Ajuste (Correção)', value: 'AJUSTE'}];

  constructor() {
    this.form = this.fb.group({
      produtoId: [null, Validators.required],
      tipo: ['ENTRADA', Validators.required],
      quantidade: [1, Validators.required],
      motivo: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService.listar().subscribe(data => 
      this.produtos = data.map(p => ({label: ${p.codigoProduto} - ${p.nome} (Atual: ${p.quantidadeEstoque}), value: p.id}))
    );
  }

  submit() {
    if (this.form.invalid) return;
    this.estoqueService.movimentar(this.form.value).subscribe({
      next: () => {
        this.msg.add({severity:'success', summary:'Sucesso', detail:'Estoque atualizado'});
        this.form.reset({tipo: 'ENTRADA', quantidade: 1});
        this.carregarProdutos(); // Atualiza os labels com novo saldo
      },
      error: (e) => this.msg.add({severity:'error', summary:'Erro', detail: e.error})
    });
  }
}