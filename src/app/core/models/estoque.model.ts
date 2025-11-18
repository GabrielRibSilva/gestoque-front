export interface MovimentacaoRequest {
  produtoId: number;
  tipo: 'ENTRADA' | 'AJUSTE';
  quantidade: number;
  motivo: string;
}