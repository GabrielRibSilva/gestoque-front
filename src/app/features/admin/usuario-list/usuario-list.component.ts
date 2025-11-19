import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UsuarioService, Usuario } from '../../../core/services/usuario.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, TableModule, ButtonModule, 
    DialogModule, InputTextModule, DropdownModule, TagModule, 
    ToastModule, ConfirmDialogModule, ToolbarModule
  ],
  templateUrl: './usuario-list.component.html', 
  providers: [MessageService, ConfirmationService]
})
export class UsuarioListComponent implements OnInit { 
  usuarios: Usuario[] = [];
  usuarioDialog: boolean = false;
  form: FormGroup;
  
  perfis = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Operador', value: 'OPERADOR' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.form = this.fb.group({
      id: [null],
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: [''], 
      perfil: ['OPERADOR', Validators.required],
      status: ['ATIVO'] 
    });
  }

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuarioService.listar().subscribe({
      next: (data) => this.usuarios = data,
      error: () => this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao listar usuários'})
    });
  }

  openNew() {
    this.form.reset({ perfil: 'OPERADOR', status: 'ATIVO' });
    this.usuarioDialog = true;
  }

  editUsuario(user: Usuario) {
    this.form.patchValue(user);
    this.form.controls['senha'].setValue(''); 
    this.usuarioDialog = true;
  }

  deleteUsuario(user: Usuario) {
    this.confirmationService.confirm({
      message: `Excluir ${user.nomeCompleto}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(user.id) {
            this.usuarioService.excluir(user.id).subscribe(() => {
                this.messageService.add({severity:'success', summary:'Sucesso', detail:'Usuário excluído'});
                this.carregarUsuarios();
            });
        }
      }
    });
  }

  saveUsuario() {
    if (this.form.invalid) return;

    if (!this.form.value.id && !this.form.value.senha) {
       this.messageService.add({severity:'error', summary:'Erro', detail:'Senha é obrigatória para novos usuários'});
       return;
    }

    this.usuarioService.salvar(this.form.value).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Usuário salvo'});
        this.usuarioDialog = false;
        this.carregarUsuarios();
      },
      error: () => this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao salvar'})
    });
  }
}