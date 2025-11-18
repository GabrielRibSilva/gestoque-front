import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProdutoService } from '../../../core/services/produto.service';
import { ProdutoResponse } from '../../../core/models/produto.model';
import { MessageService, ConfirmationService } from 'primeng/api';

// Imports PrimeNG
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, 
    InputTextModule, InputNumberModule, ConfirmDialogModule, ToolbarModule, TagModule
  ],
  templateUrl: './produto-list.component.html',
  styles: ['.field { margin-bottom: 1rem; }'],
  providers: [ConfirmationService]
})
export class ProdutoListComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  produtos: ProdutoResponse[] = [];
  produtoDialog = false;
  produtoForm: FormGroup;
  isEditMode = false;
  currentId: number | null = null;
  loading = true;

  constructor() {
    this.produtoForm = this.fb.group({
      codigoProduto: ['', Validators.required],
      nome: ['', Validators.required],
      categoria: [''],
      precoUnitario: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.produtoService.listar().subscribe({
      next: (data) => { this.produtos = data; this.loading = false; },
      error: () => { this.msg('error', 'Erro ao carregar produtos'); this.loading = false; }
    });
  }

  openNew() {
    this.produtoForm.reset();
    this.isEditMode = false;
    this.produtoDialog = true;
  }

  edit(prod: ProdutoResponse) {
    this.produtoForm.patchValue(prod);
    this.currentId = prod.id;
    this.isEditMode = true;
    this.produtoDialog = true;
  }

  delete(prod: ProdutoResponse) {
    this.confirmationService.confirm({
      message: 'Excluir ' + prod.nome + '?',
      accept: () => {
        this.produtoService.excluir(prod.id).subscribe({
          next: () => { this.msg('success', 'Excluído'); this.carregar(); },
          error: () => this.msg('error', 'Erro ao excluir (verifique se há vendas vinculadas)')
        });
      }
    });
  }

  save() {
    if (this.produtoForm.invalid) return;
    const req = this.produtoForm.value;
    const obs = this.isEditMode ? this.produtoService.atualizar(this.currentId!, req) : this.produtoService.criar(req);
    
    obs.subscribe({
      next: () => { this.msg('success', 'Salvo com sucesso'); this.produtoDialog = false; this.carregar(); },
      error: (e) => this.msg('error', e.error || 'Erro ao salvar')
    });
  }

  getSeverity(qtd: number) { return qtd > 10 ? 'success' : qtd > 0 ? 'warning' : 'danger'; }
  msg(sev: string, det: string) { this.messageService.add({ severity: sev, summary: sev, detail: det }); }
}