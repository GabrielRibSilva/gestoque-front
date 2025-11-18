import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { UsuarioResponse, UsuarioRequest } from '../../../core/models/usuario.model';
import { MessageService, ConfirmationService } from 'primeng/api';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputSwitchModule,
    TagModule,
    ConfirmDialogModule,
    ToolbarModule
  ],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
  providers: [ConfirmationService] 
})
export class UsuarioListComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  public usuarios: UsuarioResponse[] = [];
  public loading = true;

  public usuarioDialog = false;
  public usuarioForm: FormGroup;
  public isEditMode = false;
  public currentUserId: number | null = null;

  public perfis = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Operador', value: 'OPERADOR' }
  ];

  constructor() {
    this.usuarioForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      perfil: ['OPERADOR', Validators.required],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.loading = true;
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar usuários.' });
      }
    });
  }

  openNew() {
    this.usuarioForm.reset({ perfil: 'OPERADOR', ativo: true });
    this.isEditMode = false;
    this.currentUserId = null;
    this.usuarioDialog = true;
  }

  editUsuario(usuario: UsuarioResponse) {
    this.usuarioForm.patchValue({
      nomeCompleto: usuario.nomeCompleto,
      email: usuario.email,
      perfil: usuario.perfil,
      ativo: usuario.ativo,
      senha: ''
    });
    this.isEditMode = true;
    this.currentUserId = usuario.id;
    this.usuarioDialog = true;
  }

  deleteUsuario(usuario: UsuarioResponse) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${usuario.nomeCompleto}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.excluir(usuario.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído' });
            this.carregarUsuarios();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir' });
          }
        });
      }
    });
  }

  saveUsuario() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const formValue = this.usuarioForm.value;
    if (!this.isEditMode && !formValue.senha) {
       this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Senha é obrigatória para novos usuários.' });
       return;
    }

    const request: UsuarioRequest = { ...formValue };

    if (this.isEditMode && this.currentUserId) {
      this.usuarioService.atualizar(this.currentUserId, request).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado' });
          this.usuarioDialog = false;
          this.carregarUsuarios();
        },
        error: (err) => {
           const msg = err.error || 'Erro ao atualizar';
           this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
        }
      });
    } else {
      this.usuarioService.criar(request).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado' });
          this.usuarioDialog = false;
          this.carregarUsuarios();
        },
        error: (err) => {
           const msg = err.error || 'Erro ao criar';
           this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
        }
      });
    }
  }
}