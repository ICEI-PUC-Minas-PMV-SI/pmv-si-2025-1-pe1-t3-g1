## Requisitos Atendidos

As tabelas que se seguem apresentam os requisitos funcionais e não-funcionais que relacionam o escopo do projeto com os artefatos criados:

### Requisitos Funcionais

|ID    | Descrição do Requisito | Responsável | Artefato Criado |
|------|------------------------|------------|-----------------|
|RF-001| Sistema de autenticação com diferentes níveis de acesso | Eduardo Araújo | src/js/auth.js |
|RF-002| Dashboard interativo com visualização do progresso dos PANs | Eduardo Araújo | src/index.html, src/js/panCards.js |
|RF-003| Gerenciamento avançado de usuários (administrador) | Eduardo Araújo | src/admin.html |
|RF-004| Visualização detalhada e intuitiva das ações dos PANs | Eduardo Lyra | src/gerenciar-pans.html |
|RF-005| Exibição dinâmica dos cards de PANs | Eduardo Lyra | src/js/panCards.js |
|RF-006| Cálculo da porcentagem de conclusão dos objetivos | Eduardo Araújo | src/js/utils.js |
|RF-007| CRUD completo para inserção e manipulação de dados | Eduardo Lyra | src/js/addPan.js |
|RF-008| Validação de permissões para diferentes papéis de usuário | Eduardo Araújo | src/js/auth.js |
|RF-009| Integração com API ViaCEP e geolocalização | Eduardo Araújo | src/js/utils.js |
|RF-010| Sistema de paginação na visualização de PANs | Eduardo Lyra | src/js/panCards.js |
|RF-011| Funcionalidade para articuladores editarem suas próprias ações | Eduardo Araújo | src/js/addPan.js |
|RF-012| Exportação de dados dos PANs | Guilherme Borges | src/js/export.js |

## Descrição das estruturas:

## PAN (Plano de Ação Nacional)
|  **Nome**      | **Tipo**          | **Descrição**                             | **Exemplo**                                    |
|:--------------:|-------------------|-------------------------------------------|------------------------------------------------|
| Id             | Numero (Inteiro)  | Identificador único do PAN                | 1                                              |
| Título         | Texto             | Nome do PAN                               | PAN Cavernas                                   |
| Descrição      | Texto             | Descrição detalhada do PAN                | Plano de Ação Nacional para Conservação do Patrimônio Espeleológico |
| Status         | Texto             | Status atual do PAN                       | Em andamento                                   |
| Progresso      | Numero (Float)    | Porcentagem de conclusão do PAN           | 75.5                                           |
| Ações          | Array de Objetos  | Lista de ações vinculadas ao PAN          | [{id: 1, descricao: "Ação 1", status: "Concluída"}] |
| Articuladores  | Array de Objetos  | Lista de articuladores responsáveis       | [{id: 1, nome: "João Silva", email: "joao@email.com"}] |

