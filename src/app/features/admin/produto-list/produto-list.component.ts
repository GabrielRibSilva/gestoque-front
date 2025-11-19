import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProdutoService, Produto } from '../../../core/services/produto.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag'; 

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule,
    ToolbarModule, DialogModule, InputTextModule, InputNumberModule, TagModule,
    ReactiveFormsModule, FormsModule
  ],
  templateUrl: './produto-list.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ProdutoListComponent implements OnInit {
  produtos: Produto[] = [];
  loading: boolean = true;
  produtoDialog: boolean = false;
  produtoForm: FormGroup; 

  constructor(
    private produtoService: ProdutoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.produtoForm = this.fb.group({
      id: [null],
      codigoProduto: ['', Validators.required], 
      nome: ['', Validators.required],         
      categoria: [''],
      precoUnitario: [0, [Validators.required, Validators.min(0.01)]],
      quantidadeEstoque: [0, [Validators.required, Validators.min(0)]] 
    });
  }

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.loading = true;
    this.produtoService.listar().subscribe({
      next: (data) => {
        this.produtos = data;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        console.error('Erro listar:', e);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar lista' });
      }
    });
  }

  openNew() {
    this.produtoForm.reset();
    this.produtoForm.patchValue({ precoUnitario: 0, quantidadeEstoque: 0 });
    this.produtoDialog = true;
  }

  edit(prod: Produto) {
    this.produtoForm.patchValue(prod);
    this.produtoDialog = true;
  }

  delete(prod: Produto) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir ' + prod.nome + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (prod.id) {
          this.produtoService.excluir(prod.id).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto excluído' });
            this.carregarProdutos();
          });
        }
      }
    });
  }

  save() {
    if (this.produtoForm.invalid) {
      console.warn('Formulário Inválido:', this.produtoForm);
      Object.keys(this.produtoForm.controls).forEach(key => {
        this.produtoForm.get(key)?.markAsDirty();
      });
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios (Código, Nome, Preço)' });
      return;
    }

    const produto = this.produtoForm.value;

    this.produtoService.salvar(produto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto salvo com sucesso!' });
        this.produtoDialog = false;
        this.carregarProdutos();
      },
      error: (err) => {
        console.error('Erro Backend:', err);
        const msgErro = err.error || 'Erro desconhecido ao salvar';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: msgErro });
      }
    });
  }

  hideDialog() {
    this.produtoDialog = false;
  }

  getSeverity(qtd: number): "success" | "warning" | "danger" | undefined {
    if (qtd > 10) return 'success';
    if (qtd > 0) return 'warning';
    return 'danger';
  }
}