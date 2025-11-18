# Gestoque - Front-end
Este é o cliente web do projeto Gestoque. É uma aplicação "Single Page Application" (SPA) construída com Angular que consome a API REST desenvolvida no back-end. Aqui está toda a interface visual que permite aos administradores gerenciar o sistema e aos operadores realizarem vendas.

## Tecnologias Utilizadas
A aplicação foi construída utilizando uma stack moderna e componentes robustos:

Angular 17: Utilizamos a versão mais recente com o recurso de "Standalone Components", o que elimina a necessidade de módulos (ngModule) e deixa a estrutura mais leve.

TypeScript: Para tipagem estática e segurança no código.

PrimeNG 17: Biblioteca de componentes visuais. Usamos ela para tabelas, formulários, botões, diálogos (modais) e notificações (toasts).

PrimeFlex: Sistema de grid e utilitários CSS para facilitar o layout responsivo.

RxJS: Para manipulação de fluxos de dados assíncronos e comunicação com a API.

## Como Executar
Antes de começar, certifique-se de que você tem o Node.js (versão 18 ou superior) instalado na sua máquina e que o back-end do Gestoque já esteja rodando na porta 8080.

Abra o terminal na pasta gestoque-front.

Instale as dependências do projeto (isso baixa o Angular, PrimeNG, etc.):

Bash

npm install
Inicie o servidor de desenvolvimento:

Bash

ng serve
Abra o navegador e acesse: http://localhost:4200

## Estrutura do Projeto
O código está organizado dentro de src/app seguindo uma divisão por responsabilidades.

Core (O núcleo da aplicação)
Localizado em src/app/core. Aqui ficam as peças fundamentais que fazem o sistema funcionar:

Services: São as classes responsáveis por fazer as chamadas HTTP para o back-end.

AuthService: Gerencia login e sessão (localStorage).

UsuarioService, ProdutoService, EstoqueService, VendaService: Conectam com seus respectivos endpoints na API.

Guards: Responsáveis pela segurança das rotas.

AuthGuard: Impede que usuários não logados acessem páginas internas.

RoleGuard: Verifica o perfil (ADMIN ou OPERADOR) e bloqueia o acesso se o usuário não tiver permissão para aquela tela específica.

Models: Interfaces TypeScript que definem o formato dos dados (ex: Produto, VendaRequest), garantindo que o front envie e receba exatamente o que o back espera.

Layout: O componente MainLayoutComponent define a estrutura da "área logada", contendo a barra de topo e o menu lateral dinâmico.

## Features (As telas do sistema)
Localizado em src/app/features. Aqui estão os componentes visuais que o usuário interage.

### Autenticação (auth)
Login: Tela inicial com formulário de e-mail e senha. Se o login for bem-sucedido, o token do usuário é salvo e ele é redirecionado para o painel.

### Administração (admin)
Telas acessíveis apenas por usuários com perfil ADMIN.

UsuarioList: Listagem de usuários com opções de criar, editar e excluir.

ProdutoList: Catálogo de produtos. Permite cadastrar e editar preços/nomes. O estoque é visível, mas travado para edição direta.

EstoqueMovimentacao: Tela específica para dar entrada (compras) ou ajustar saldos de produtos.

### Operação (operador)
Telas acessíveis por usuários com perfil OPERADOR (e admins).

CaixaVenda: A tela de Ponto de Venda (PDV). Permite buscar produtos, adicionar ao carrinho local, calcular subtotal e finalizar a venda, enviando tudo para a API processar.

### Relatórios (relatorios)
Relatorios: Tela de consulta histórica. Permite filtrar vendas por data e visualizar o total faturado.

## Configuração de Ambiente
Atualmente, o endereço da API está definido diretamente nos serviços (src/app/core/services/) apontando para http://localhost:8080/api.

Caso precise apontar para um servidor diferente, você deve alterar a constante API_URL dentro de cada serviço ou configurar os arquivos de environment.

## Observações Importantes
Validações: Usamos Reactive Forms do Angular para validar campos (como e-mail obrigatório ou preço maior que zero) antes mesmo de enviar para o servidor.

Feedback: O sistema utiliza o MessageService do PrimeNG para exibir "Toasts" (notificações flutuantes) de sucesso ou erro no canto da tela.

Estoque: O estoque no front-end é apenas uma visualização. A validação real de "estoque insuficiente" é feita pelo back-end, mas o front tenta prevenir erros bloqueando a adição de itens indisponíveis no carrinho.
