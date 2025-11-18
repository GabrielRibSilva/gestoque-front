export interface ItemVendaRequest {
  produtoId: number;
  quantidade: number;
}
export interface VendaRequest {
  usuarioResponsavelId: number;
  valorRecebido: number;
  itens: ItemVendaRequest[];
}