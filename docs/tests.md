# Testes

Neste projeto serão realizados dois tipos de testes:

 - O **Teste de Software**, que utiliza uma abordadem de caixa preta, e tem por objetivo verificar a conformidade do software com os requisitos funcionais e não funcionais do sistema.
 - O **Teste de Usabilidade**, que busca avaliar a qualidade do uso do sistema por um usuário do público alvo. 

Se quiser conhecer um pouco mais sobre os tipos de teste de software, leia o documento [Teste de Software: Conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/).

A documentação dos testes é dividida nas seguintes seções:

 - [Plano de Testes de Software](#plano-de-testes-de-software)
 - [Registro dos Testes de Software](#registro-dos-testes-de-software)
 - [Avaliação dos Testes de Software](#avaliação-dos-testes-de-software)
 - [Cenários de Teste de Usabilidade](#cenários-de-teste-de-usabilidade)
 - [Registro dos Testes de Usabilidade](#registro-dos-testes-de-usabilidade)
 - [Avaliação dos Testes de Usabilidade](#avaliação-dos-testes-de-usabilidade)

# Teste de Software

Nesta seção o grupo deverá documentar os testes de software que verificam a correta implementação dos requisitos funcionais e não funcionais do software.

## Plano de Testes de Software

Preencha a tabela com o plano dos testes. Para cada Caso de Teste (CT), associe qual o Requisito Funcional ou não funcional que ele está verificando. Associe também a página (ou artefato) onde o teste será realizado e descreva o cenário do teste. Veja a tabela de exemplo.


**Caso de Teste** | **CT01 - Cadastrar novo PAN**
 :--------------: | ------------
**Procedimento**  | 1) Fazer login como usuário com papel “admin”<br> 2) Clicar em “+” (Adicionar PAN) <br> 3) Preencher campos obrigatórios: Título, Descrição, Período, Duração, Coordenador<br> 4) Adicionar ao menos 1 objetivo e 1 ação válida<br> 5) Clicar em “Salvar PAN”
**Requisitos associados** | RF-001
**Resultado esperado** | Novo PAN aparece listado na página e salvo em localStorage com todos os campos preenchidos
**Dados de entrada** | Título: “PAN Exemplo”<br> Descrição: “Descrição detalhada”<br> Período: “01/2025 a 12/2025”<br> Coordenador: ID válido<br> Objetivos/Ações: lista com 1 objetivo e 1 ação
**Resultado obtido** | -

**Caso de Teste** | **CT02 - Verificar controle de permissões**
 :--------------: | ------------
**Procedimento**  | 1) Login como usuário “coordenador”<br> 2) Verificar botão “Adicionar PAN” visível<br> 3) Tentar editar PAN cujo coordenador ≠ meu ID<br> 4) Login como usuário “articulador”<br> 5) Verificar que não há botões de editar/excluir em nenhum PAN
**Requisitos associados** | RF-002
**Resultado esperado** | Coordenador só edita PANs onde coordenador === meu ID; articulador não vê botões de editar/excluir
**Dados de entrada** | Usuário A: papel “coordenador”, ID = A<br>Usuário B: papel “articulador”, ID = B
**Resultado obtido** | -

**Caso de Teste** | **CT03 - Atualizar status de ações**
 :--------------: | ------------
**Procedimento**  | 1) Login como “articulador” responsável pelo PAN X<br> 2) Abrir detalhes do PAN X<br> 3) Alterar status de uma ação (“Não iniciada” → “Em andamento”)<br> 4) Fechar e reabrir modal de detalhes
**Requisitos associados** | RF-003, RF-007
**Resultado esperado** | Novo status persistido em localStorage e exibido corretamente na UI
**Dados de entrada** | PAN X com ação atribuída ao articulador<br>Status inicial: “Não iniciada”
**Resultado obtido** | -

**Caso de Teste** | **CT05 - Filtrar lista de PANs**
 :--------------: | ------------
**Procedimento**  | 1) Acessar listagem de PANs<br> 2) Digitar “Recursos” no campo de busca<br> 3) Selecionar filtro de status “Concluído”<br> 4) Aplicar filtros
**Requisitos associados** | RF-005, RF-013
**Resultado esperado** | Exibem-se apenas PANs cujo título contenha “Recursos” e status “Concluído”
**Dados de entrada** | Múltiplos PANs com títulos e status diversos<br>- Termo de busca: “Recursos”<br>- Status selecionado: “Concluído”
**Resultado obtido** | -

**Caso de Teste** | **CT06 - Visualizar painel consolidado**
 :--------------: | ------------
**Procedimento**  | 1) Login como “admin” e acessar dashboard<br> 2) Confirmar seção “Painel Consolidado” com dados de todos os PANs<br> 3) Login como “coordenador” e acessar dashboard<br> 4) Confirmar que painel mostra apenas PANs sob sua responsabilidade
**Requisitos associados** | RF-006
**Resultado esperado** | Admin vê dados consolidados de todos os PANs; coordenador vê somente seus PANs
**Dados de entrada** | Usuário admin com acesso a todos os PANs<br>- Usuário coordenador com subset de PANs
**Resultado obtido** | -

**Caso de Teste** | **CT07 - Exportar relatórios PDF/CSV**
 :--------------: | ------------
**Procedimento**  | 1) Acessar listagem de PANs<br> 2) Clicar em “Exportar PDF” e baixar arquivo<br> 3) Clicar em “Exportar CSV” e baixar arquivo
**Requisitos associados** | RF-009, RF-011
**Resultado esperado** | Arquivos PDF e CSV gerados com cabeçalhos corretos e linhas correspondentes aos PANs listados
**Dados de entrada** | Lista com pelo menos 2 PANs ativos
**Resultado obtido** | -

**Caso de Teste** | **CT08 - Notificação de vencimento de prazo**
 :--------------: | ------------
**Procedimento**  | 1) Simular data do sistema 3 dias antes da data de término de uma ação<br>2) Acessar dashboard ou aguardar alerta via UI/alert()
**Requisitos associados** | RF-010
**Resultado esperado** | Notificação alerta articulador sobre vencimento de prazo e solicita atualização dos dados da ação
**Dados de entrada** | Ação com data de término = hoje + 3 dias
**Resultado obtido** | -


## Registro dos Testes de Software

Esta seção deve apresentar o relatório com as evidências dos testes de software realizados no sistema pela equipe, baseado no plano de testes pré-definido. Documente cada caso de teste apresentando um vídeo ou animação que comprove o funcionamento da funcionalidade. Veja os exemplos a seguir.

|*Caso de Teste*                                 |*CT01 - Cadastrar novo PAN*                                         |
|---|---|
|Requisito Associado | RF-001 - A aplicação deve permitir que os usuários criem uma conta e gerenciem seu cadastro|
|Link do vídeo do teste realizado: | https://1drv.ms/u/s!AhD2JqpOUvJChapRtRSQ9vPzbNLwGA?e=mxZs6t| 

|*Caso de Teste*                                 |*CT02 - Criar conta parte 2*                                        |
|---|---|
|Requisito Associado | RF-001 - A aplicação deve permitir que os usuários criem uma conta e gerenciem seu cadastro|
|Link do vídeo do teste realizado: | https://1drv.ms/v/s!AhD2JqpOUvJChapQ8CPXL-TI_A7iVg?e=spD3Ar | 


## Avaliação dos Testes de Software

Discorra sobre os resultados do teste. Ressaltando pontos fortes e fracos identificados na solução. Comente como o grupo pretende atacar esses pontos nas próximas iterações. Apresente as falhas detectadas e as melhorias geradas a partir dos resultados obtidos nos testes.

## Testes de unidade automatizados (Opcional)

Se o grupo tiver interesse em se aprofundar no desenvolvimento de testes de software, ele podera desenvolver testes automatizados de software que verificam o funcionamento das funções JavaScript desenvolvidas. Para conhecer sobre testes unitários em JavaScript, leia 0 documento  [Ferramentas de Teste para Java Script](https://geekflare.com/javascript-unit-testing/).

# Testes de Usabilidade

O objetivo do Plano de Testes de Usabilidade é obter informações quanto à expectativa dos usuários em relação à  funcionalidade da aplicação de forma geral.

Para tanto, elaboramos quatro cenários, cada um baseado na definição apresentada sobre as histórias dos usuários, definido na etapa das especificações do projeto.

Foram convidadas quatro pessoas que os perfis se encaixassem nas definições das histórias apresentadas na documentação, visando averiguar os seguintes indicadores:

Taxa de sucesso: responde se o usuário conseguiu ou não executar a tarefa proposta;

Satisfação subjetiva: responde como o usuário avalia o sistema com relação à execução da tarefa proposta, conforme a seguinte escala:

1. Péssimo; 
2. Ruim; 
3. Regular; 
4. Bom; 
5. Ótimo.

Tempo para conclusão da tarefa: em segundos, e em comparação com o tempo utilizado quando um especialista (um desenvolvedor) realiza a mesma tarefa.

Objetivando respeitar as diretrizes da Lei Geral de Proteção de Dados, as informações pessoais dos usuários que participaram do teste não foram coletadas, tendo em vista a ausência de Termo de Consentimento Livre e Esclarecido.

Apresente os cenários de testes utilizados na realização dos testes de usabilidade da sua aplicação. Escolha cenários de testes que demonstrem as principais histórias de usuário sendo realizadas. Neste tópico o grupo deve detalhar quais funcionalidades avaliadas, o grupo de usuários que foi escolhido para participar do teste e as ferramentas utilizadas.

> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7)


## Cenários de Teste de Usabilidade

| Nº do Cenário | Descrição do cenário |
|---------------|----------------------|
| 1             | Você é uma pessoa que deseja comprar um iphone. Encontre no site um iphone e veja detalhes de localização e contato da loja que anunciando. |
| 2             | Você é uma pessoa que deseja comprar um smartphone até R$ 2.000,00. Encontre no site smartphone's nessa faixa de preço. |



## Registro de Testes de Usabilidade

Cenário 1: Você é uma pessoa que deseja comprar um iphone. Encontre no site um iphone e veja detalhes de localização e contato da loja que anunciando.

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| 1       | SIM             | 5                    | 27.87 segundos                  |
| 2       | SIM             | 5                    | 17.11 segundos                  |
| 3       | SIM             | 5                    | 39.09 segundos                  |
|  |  |  |  |
| **Média**     | 100%           | 5                | 28.02 segundos                           |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 8.66 segundos |


    Comentários dos usuários: Achei o site muito bom e intuitivo. 
    Não tive dificuldades e acho que ficou bem intuitivo.


Cenário 2: Você é uma pessoa que deseja comprar um smartphone até R$ 2.000,00. Encontre no site smartphone's nessa faixa de preço.

| Usuário | Taxa de sucesso | Satisfação subjetiva | Tempo para conclusão do cenário |
|---------|-----------------|----------------------|---------------------------------|
| 1       | SIM             | 5                    | 22.54 segundos                          |
| 2       | SIM             | 5                    | 31.42 segundos                          |
| 3       | SIM             | 4                    | 36.21 segundos                          |
|  |  |  |  |
| **Média**     | 100%           | 4.67                | 30.05 segundos                           |
| **Tempo para conclusão pelo especialista** | SIM | 5 | 13.57 segundos |


    Comentários dos usuários: O site é fácil de acessar, mas algumas páginas poderiam 
    redirecionar a gente automaticamente para outras. Senti a falta de mais opções de filtros, 
    tanto na hora da pesquisa, quanto depois dela, nos resultados.

## Avaliação dos Testes de Usabilidade

Tomando como base os resultados obtidos, foi possível verificar que a aplicação web apresenta bons resultados quanto à taxa de sucesso na interação dos usuários, tendo em vista que os cenários propostos foram concluídos com sucesso.

Além disso, a aplicação obteve também uma elevada satisfação subjetiva dos usuários no momento que realizavam os cenários propostos. Prova são as médias das avaliações em cada um dos cenários, que variou entre 4 (bom) e 5 (ótimo).

Com relação ao tempo para conclusão de cada tarefa/cenário, notamos discrepância entre a média de tempo dos usuários e o tempo do especialista/desenvolvedor em todos os cenários. Tal discrepância, em certa medida, é esperada, tendo em vista que o desenvolvedor já tem prévio conhecimento de toda a interface da aplicação, do posicionamento dos elementos, lógica de organização das páginas, etc.

Contudo, tendo em vista que a diferença foi relevante (por exemplo, 113 segundos — média usuários — contra 25 segundos — especialista — no cenário três), e ainda os comentários feitos por alguns usuários, entendemos haver oportunidades de melhoria na usabilidade da aplicação.



