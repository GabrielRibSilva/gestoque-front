import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EstoqueService } from '../../../core/services/estoque.service';
import { ProdutoService } from '../../../core/services/produto.service';

import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-estoque-movimentacao',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CardModule, DropdownModule,
    InputNumberModule, InputTextareaModule, ButtonModule, ToastModule
  ],
  templateUrl: './estoque-movimentacao.component.html',
  providers: [MessageService]
})
export class EstoqueMovimentacaoComponent implements OnInit {
  form: FormGroup;
  produtos: any[] = [];
  
  tipos = [
    { label: 'Entrada (Reposição)', value: 'ENTRADA' },
    { label: 'Ajuste (Correção)', value: 'AJUSTE' }
  ];

  constructor(
    private fb: FormBuilder,
    private estoqueService: EstoqueService,
    private produtoService: ProdutoService,
    private msg: MessageService
  ) {
    this.form = this.fb.group({
      produtoId: [null, Validators.required],
      tipo: ['ENTRADA', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      observacao: ['']
    });
  }

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService.listar().subscribe({
      next: (data) => {
        this.produtos = data.map(p => ({
          label: `${p.codigoProduto} - ${p.nome} (Saldo: ${p.quantidadeEstoque})`,
          value: p.id 
        }));
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar lista de produtos' })
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.estoqueService.movimentar(this.form.value).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimentação registrada!' });
        
        this.form.reset();
        
        this.form.patchValue({ 
            tipo: 'ENTRADA', 
            quantidade: 1 
        });
        
        this.carregarProdutos(); 
      },
      error: (err) => {
        console.error(err);
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível registrar a movimentação.' });
      }
    });
  }
}