export interface UsuarioRequest {
  nomeCompleto: string;
  email: string;
  senha?: string;
  perfil: string; 
  ativo: boolean;
}

export interface UsuarioResponse {
  id: number;
  nomeCompleto: string;
  email: string;
  perfil: string;
  ativo: boolean;
}