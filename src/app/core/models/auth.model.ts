export enum PerfilUsuario {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR'
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  id: number;
  nome: string;
  perfil: PerfilUsuario;
}

export type Sessao = LoginResponse;