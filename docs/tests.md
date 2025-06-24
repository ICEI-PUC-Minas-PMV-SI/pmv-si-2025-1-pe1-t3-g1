## Plano de Testes de Software

**Caso de Teste** | **CT01 - Cadastrar novo PAN**
 :--------------: | ------------
**Procedimento**  | 1) Fazer login como usuário com papel "admin"<br> 2) Clicar em "+" (Adicionar PAN) <br> 3) Preencher campos obrigatórios: Título, Descrição, Período, Duração, Coordenador<br> 4) Adicionar ao menos 1 objetivo e 1 ação válida<br> 5) Clicar em "Salvar PAN"
**Requisitos associados** | RF-001
**Resultado esperado** | Novo PAN aparece listado na página e salvo em localStorage com todos os campos preenchidos
**Dados de entrada** | Título: "PAN Exemplo"<br> Descrição: "Descrição detalhada"<br> Período: "01/2025 a 12/2025"<br> Coordenador: ID válido<br> Objetivos/Ações: lista com 1 objetivo e 1 ação
**Resultado obtido** | Satisfatório

**Caso de Teste** | **CT02 - Verificar controle de permissões**
 :--------------: | ------------
**Procedimento**  | 1) Login como usuário "coordenador"<br> 2) Verificar botão "Adicionar PAN" visível<br> 3) Tentar editar PAN cujo coordenador ≠ meu ID<br> 4) Login como usuário "articulador"<br> 5) Verificar que não há botões de editar/excluir em nenhum PAN
**Requisitos associados** | RF-002
**Resultado esperado** | Coordenador só edita PANs onde coordenador === meu ID; articulador não vê botões de editar/excluir
**Dados de entrada** | Usuário A: papel "coordenador", ID = A<br>Usuário B: papel "articulador", ID = B
**Resultado obtido** | Satisfatório

**Caso de Teste** | **CT03 - Atualizar status de ações**
 :--------------: | ------------
**Procedimento**  | 1) Login como "articulador" responsável pelo PAN X<br> 2) Abrir detalhes do PAN X<br> 3) Alterar status de uma ação ("Não iniciada" → "Em andamento")<br> 4) Fechar e reabrir modal de detalhes
**Requisitos associados** | RF-003, RF-007
**Resultado esperado** | Novo status persistido em localStorage e exibido corretamente na UI
**Dados de entrada** | PAN X com ação atribuída ao articulador<br>Status inicial: "Não iniciada"
**Resultado obtido** | Satisfatório

**Caso de Teste** | **CT04 - Filtrar lista de PANs**
 :--------------: | ------------
**Procedimento**  | 1) Acessar listagem de PANs<br> 2) Digitar "Recursos" no campo de busca<br> 3) Selecionar filtro de status "Concluído"<br> 4) Aplicar filtros
**Requisitos associados** | RF-005, RF-013
**Resultado esperado** | Exibem-se apenas PANs cujo título contenha "Recursos" e status "Concluído"
**Dados de entrada** | Múltiplos PANs com títulos e status diversos<br>- Termo de busca: "Recursos"<br>- Status selecionado: "Concluído"
**Resultado obtido** | Satisfatório

**Caso de Teste** | **CT05 - Visualizar painel consolidado**
 :--------------: | ------------
**Procedimento**  | 1) Login como "admin" e acessar dashboard<br> 2) Confirmar seção "Painel Consolidado" com dados de todos os PANs<br> 3) Login como "coordenador" e acessar dashboard<br> 4) Confirmar que painel mostra apenas PANs sob sua responsabilidade
**Requisitos associados** | RF-006
**Resultado esperado** | Admin vê dados consolidados de todos os PANs; coordenador vê somente seus PANs
**Dados de entrada** | Usuário admin com acesso a todos os PANs<br>- Usuário coordenador com subset de PANs
**Resultado obtido** | Satisfatório

**Caso de Teste** | **CT06 - Exportar relatórios PDF/CSV**
 :--------------: | ------------
**Procedimento**  | 1) Acessar listagem de PANs<br> 2) Clicar em "Exportar PDF" e baixar arquivo<br> 3) Clicar em "Exportar CSV" e baixar arquivo
**Requisitos associados** | RF-009, RF-011
**Resultado esperado** | Arquivos PDF e CSV gerados com cabeçalhos corretos e linhas correspondentes aos PANs listados
**Dados de entrada** | Lista com pelo menos 2 PANs ativos
**Resultado obtido** | Satisfatório


## Registro dos Testes de Software

|*Caso de Teste*                                 |*CT01 - Cadastrar novo PAN*                                         |
|---|---|
|Requisito Associado | RF-001 - Novo PAN aparece listado na página e salvo em localStorage com todos os campos preenchidos|
|Link do vídeo do teste realizado: | https://drive.google.com/file/d/1HKVODZb99jTtDa-oZNW_1dxKu6ZZUGHi/view?usp=drive_link | 

|*Caso de Teste*                                 |*CT02 - Verificar controle de permissões*                                        |
|---|---|
|Requisito Associado | RF-002 - Coordenador só edita PANs onde coordenador === meu ID; articulador não vê botões de editar/excluir|
|Link do vídeo do teste realizado: | https://drive.google.com/file/d/12az31euPuM7zW-EDa8H37xr4r61gRoM8/view?usp=drive_link | 

|*Caso de Teste*                                 |*CT03 - Atualizar status de ações*                                        |
|---|---|
|Requisito Associado | RF-003, RF-007 - Novo status persistido em localStorage e exibido corretamente na UI|
|Link do vídeo do teste realizado: | https://drive.google.com/file/d/1X539L41UZrl1dXCwE_AdEVv631vW-kPA/view?usp=drive_link | 

|*Caso de Teste*                                 |*CT04 - Filtrar lista de PANs*                                        |
|---|---|
|Requisito Associado | RF-005, RF-013 - Exibem-se apenas PANs cujo título contenha "Recursos" e status "Concluído"|
|Link do vídeo do teste realizado: | https://drive.google.com/file/d/15lgYEwrgb8Ari3gQNhFdu8GI5yElp8GD/view?usp=drive_link | 

|*Caso de Teste*                                 |*CT05 - Visualizar painel consolidado*                                        |
|---|---|
|Requisito Associado | RF-006 - Admin vê dados consolidados de todos os PANs; coordenador vê somente seus PANs|
|Link do vídeo do teste realizado: | https://drive.google.com/file/d/1cpG-VQzEGyLFn8AkjFWlRf1rTkdzqAXg/view?usp=drive_link | 

|*Caso de Teste*                                 |*CT06 - Exportar relatórios PDF/CSV*                                        |
|---|---|
|Requisito Associado | RF-009, RF-011 - Arquivos PDF e CSV gerados com cabeçalhos corretos e linhas correspondentes aos PANs listados|
|Link do vídeo do teste realizado: | https://drive.google.com/file/d/1WT_rzylPYuEBE4cqZYMLFYBDMuIVh_DI/view?usp=drive_link | 

## Avaliação dos Testes de Software

Todos os casos de testes foram atendidos. Pequenas melhorias em níveis de acesso, paginação e no projeto como um todo. O desempenho obtido com o RT foi satisfatório e compriu todos os requisitos.

## Testes de unidade automatizados

O projeto implementa testes automatizados utilizando Jest como framework de teste e Husky para garantir a execução dos testes antes de cada commit. Os testes estão organizados em três arquivos principais:

### 1. Testes de PANs (`pan.test.js`)

Testa as funcionalidades relacionadas ao gerenciamento de PANs:

| Funcionalidade | Descrição do Teste | Resultado |
|---------------|-------------------|-----------|
| Adicionar PAN | Verifica se um novo PAN é adicionado corretamente ao localStorage | ✅ Passou |
| Editar PAN | Testa a edição de um PAN existente, verificando se as alterações são persistidas | ✅ Passou |
| Remover PAN | Confirma se um PAN é removido corretamente do sistema | ✅ Passou |
| Renderização | Verifica a renderização dos cards e controles de paginação | ✅ Passou |
| Atualização de Charts | Testa a atualização dos gráficos de monitoramento | ✅ Passou |

### 2. Testes de Usuários (`user.test.js`)

Testa as funcionalidades relacionadas ao gerenciamento de usuários:

| Funcionalidade | Descrição do Teste | Resultado |
|---------------|-------------------|-----------|
| Registro de Usuário | Verifica se um novo usuário é registrado corretamente | ✅ Passou |
| Edição de Usuário | Testa a edição de dados de um usuário existente | ✅ Passou |
| Inativação de Usuário | Confirma se um usuário pode ser inativado corretamente | ✅ Passou |
| Proteção de Master | Verifica se o usuário master não pode ser inativado | ✅ Passou |

### 3. Configuração de Testes (`setup.js`)

Arquivo de configuração que estabelece o ambiente de testes:

- Mock do localStorage para simular persistência de dados
- Mock de funções do window (loadFromServer, saveToServer)
- Mock de funções de formatação (formatCurrency, formatCEP)
- Mock de funções de UI (getStatusClass, getStatusIcon)
- Mock de elementos do DOM para testes de interface

### Integração com Husky

O projeto utiliza Husky para garantir a qualidade do código através de hooks do Git:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm test"
    }
  }
}
```

Isso garante que:
1. Os testes são executados automaticamente antes de cada commit
2. Commits são bloqueados se algum teste falhar
3. O código só é enviado ao repositório se passar em todos os testes

### Cobertura de Testes

Os testes cobrem as principais funcionalidades do sistema:

- ✅ Gerenciamento de PANs (CRUD completo)
- ✅ Gerenciamento de Usuários
- ✅ Controle de Permissões
- ✅ Persistência de Dados
- ✅ Renderização de Interface
- ✅ Validações de Negócio

Para executar os testes localmente:
```bash
npm test
```

Para ver a cobertura de testes:
```bash
npm test -- --coverage
```

# Testes de Usabilidade

## Cenários de Teste de Usabilidade

| Nº do Cenário | Descrição do cenário |
|---------------|----------------------|
| 1             | Você é um coordenador que precisa cadastrar um novo PAN no sistema. Faça login, cadastre um novo PAN com título, descrição, objetivos e ações. |
| 2             | Você é um articulador que precisa atualizar o status de suas ações atribuídas. Faça login, encontre suas ações e atualize o status de pelo menos uma delas. |
| 3             | Você é um administrador que precisa gerar um relatório de progresso dos PANs. Acesse o painel administrativo e exporte um relatório em PDF. |
| 4             | Você é um usuário comum que precisa visualizar informações sobre um PAN específico. Use os filtros de busca para encontrar um PAN e visualize seus detalhes. |
| 5             | Você é um coordenador que precisa gerenciar os articuladores de um PAN. Acesse o PAN e adicione/remova articuladores das ações. |

## Registro de Testes de Usabilidade

Cenário 1: Cadastro de novo PAN como coordenador

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| Eduardo A. | SIM          | 5                    | 25 segundos                     |
| Eduardo L. | SIM          | 4                    | 30 segundos                     |
| Guilherme | SIM          | 5                    | 28 segundos                     |
| **Média**  | 100%         | 4.67                 | 27.67 segundos                  |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 20 segundos |

Cenário 2: Atualização de status de ações como articulador

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| Eduardo A. | SIM          | 5                    | 8 segundos                      |
| Eduardo L. | SIM          | 5                    | 10 segundos                     |
| Guilherme | SIM          | 4                    | 9 segundos                      |
| **Média**  | 100%         | 4.67                 | 9 segundos                      |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 5 segundos |

Cenário 3: Geração de relatório como administrador

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| Eduardo A. | SIM          | 4                    | 5 segundos                      |
| Eduardo L. | SIM          | 5                    | 4 segundos                      |
| Guilherme | SIM          | 5                    | 6 segundos                      |
| **Média**  | 100%         | 4.67                 | 5 segundos                      |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 3 segundos |

Cenário 4: Busca e visualização de PAN como usuário comum

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| Eduardo A. | SIM          | 5                    | 10 segundos                     |
| Eduardo L. | SIM          | 5                    | 8 segundos                      |
| Guilherme | SIM          | 5                    | 12 segundos                     |
| **Média**  | 100%         | 5                    | 10 segundos                     |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 5 segundos |

Cenário 5: Gerenciamento de articuladores como coordenador

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| Eduardo A. | SIM          | 4                    | 15 segundos                     |
| Eduardo L. | SIM          | 4                    | 18 segundos                     |
| Guilherme | SIM          | 5                    | 12 segundos                     |
| **Média**  | 100%         | 4.33                 | 15 segundos                     |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 8 segundos |

## Avaliação dos Testes de Usabilidade

Com base nos resultados obtidos, podemos concluir que o sistema apresenta uma excelente taxa de sucesso na interação dos usuários, com 100% de conclusão em todos os cenários propostos.

### Pontos Positivos:
1. Alta taxa de satisfação dos usuários, com média geral de 4.67 em 5.0
2. Interface centralizada com dialogs permite navegação rápida e eficiente
3. Tempos de execução muito baixos devido à arquitetura otimizada do sistema
4. Acesso rápido a todas as funcionalidades principais através da interface única

### Oportunidades de Melhoria:
1. O cadastro de novo PAN (cenário 1) ainda é a operação mais demorada, mesmo que rápida
2. Pequena variação nos tempos entre usuários no gerenciamento de articuladores
3. Alguns usuários sugerem que o feedback visual poderia ser mais claro

### Recomendações:
1. Adicionar atalhos de teclado para operações comuns
2. Implementar feedback visual mais claro para ações concluídas
3. Considerar autocompletar para campos de busca e seleção
4. Manter a estrutura centralizada que tem se mostrado muito eficiente

O sistema demonstrou ser extremamente eficiente, com tempos de execução muito baixos devido à sua arquitetura centralizada em HTML com dialogs. As melhorias sugeridas são principalmente refinamentos em uma base já muito sólida.



