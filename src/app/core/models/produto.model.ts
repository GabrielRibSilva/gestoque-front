export interface ProdutoRequest {
  codigoProduto: string;
  nome: string;
  categoria?: string;
  precoUnitario: number;
}

export interface ProdutoResponse {
  id: number;
  codigoProduto: string;
  nome: string;
  categoria: string;
  quantidadeEstoque: number;
  precoUnitario: number;
}