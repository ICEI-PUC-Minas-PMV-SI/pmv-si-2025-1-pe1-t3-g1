# Especificações do Projeto

Definição do problema e ideia de solução a partir da perspectiva do usuário. É composta pela definição do  diagrama de personas, histórias de usuários, requisitos funcionais e não funcionais além das restrições do projeto.

Apresente uma visão geral do que será abordado nesta parte do documento, enumerando as técnicas e/ou ferramentas utilizadas para realizar a especificações do projeto.

Caso deseje atribuir uma imagem a sua persona, utilize o site https://thispersondoesnotexist.com/

## Personas

1. Júlia, servidora do ICMBio, lotada na sede do ICMBio em Brasília, coordena todos os PANs executados pelo ICMBio. Júlia é responsável por definir quais PANs serão desenvolvidos. Júlia também precisa ter acesso aos dados de todos os PANs para tomada de decisão e, atualmente, precisa ficar abrindo as planilhas XLSX de cada PAN para acessar as informações, pois não há uma solução de tecnologia da informação que centralize tudo em uma única plataforma.

2. Márcio, servidor do ICMBio, é responsável por conduzir o PAN Cavernas do Brasil. Durante as oficinas de monitoria encontra dificuldades em preencher as planilhas em formato XLSX. Além disso, Márcio gasta muito tempo enviando e-mails aos articuladores solicitando o preenchimento de planilhas com as informações do andamento das ações e, depois, consolidando as respostas recebidas. 

3. Tenório, professor de universidade pública, é articulador de algumas ações do PAN Cavernas do Brasil. Em um momento pré-monitoria, recebe por e-mail uma planilha XLSX para atualizar as informações pertinentes às ações de que é responsável. Tenório preenche a planilha enviada por Márcio e responde ao e-mail com ela em anexo.

4. Jacinta é diretora no ICMBio e precisa de um relatório sobre o andamento do PAN Cavernas do Brasil para apresentar em uma reunião no Ministério do Meio Ambiente. Para tanto, solicita à Júlia que providencie este relatório. Júlia, por sua vez, solicita a Márcio a consolidação das informações. Márcio, então, consulta a planilha para gerar o relatório.

5. Alice é uma jornalista e precisa de informações sobre os recursos gastos nos PANS para compor os dados da sua matéria sobre porcentagem do PIB gasta em ações de conservação. No site do ICMBio, Alice tem que baixar todas as planilhas de todos os PANs e consultar uma a uma para fazer a consolidação dos dados.

Enumere e detalhe as personas da sua solução. Para tanto, baseie-se tanto nos documentos disponibilizados na disciplina e/ou nos seguintes links:

> **Links Úteis**:
> - [Rock Content](https://rockcontent.com/blog/personas/)
> - [Hotmart](https://blog.hotmart.com/pt-br/como-criar-persona-negocio/)
> - [O que é persona?](https://resultadosdigitais.com.br/blog/persona-o-que-e/)
> - [Persona x Público-alvo](https://flammo.com.br/blog/persona-e-publico-alvo-qual-a-diferenca/)
> - [Mapa de Empatia](https://resultadosdigitais.com.br/blog/mapa-da-empatia/)
> - [Mapa de Stalkeholders](https://www.racecomunicacao.com.br/blog/como-fazer-o-mapeamento-de-stakeholders/)
>
Lembre-se que você deve ser enumerar e descrever precisamente e personalizada todos os clientes ideais que sua solução almeja.

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

| EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE`                                    | PARA ... `MOTIVO/VALOR`                                          |
|---------------------|-----------------------------------------------------------------------|------------------------------------------------------------------|
| Júlia               | Definir quais PANs serão desenvolvidos                                | Planejar e priorizar ações de conservação                        |
| Júlia               | Acessar dados consolidados de todos os PANs em um só lugar            | Tomar decisões sem precisar abrir múltiplas planilhas            |
| Júlia               | Gerar relatórios gerenciais detalhados                                | Fornecer informações estratégicas para diretoria e ministérios   |
| Márcio              | Cadastrar e atualizar ações no PAN Cavernas do Brasil                 | Manter atualizado o planejamento sem depender de planilhas       |
| Márcio              | Solicitar atualizações dos articuladores via sistema                  | Automatizar o processo e reduzir tempo gasto enviando manualmente|
| Márcio              | Visualizar e consolidar informações enviadas pelos articuladores      | Ter um panorama atualizado para prestação de contas              |
| Tenório             | Atualizar o andamento das ações sob minha responsabilidade via sistema| Evitar o uso de e-mails e planilhas                              |
| Jacinta             | Acessar relatórios prontos e métricas atualizadas dos PANs            | Apresentar informações estratégicas em reuniões                  |
| Alice               | Consultar dados de forma transparente dos PANs diretamente pelo site  | Agilizar o acesso às informações para suas matérias              |
| Alice               | Filtrar dados por PANs, período, tipo de gasto e etc.                 | Encontrar rapidamente informações relevantes para sua reportagem |

Apresente aqui as histórias de usuário que são relevantes para o projeto de sua solução. As Histórias de Usuário consistem em uma ferramenta poderosa para a compreensão e elicitação dos requisitos funcionais e não funcionais da sua aplicação. Se possível, agrupe as histórias de usuário por contexto, para facilitar consultas recorrentes à essa parte do documento.

> **Links Úteis**:
> - [Histórias de usuários com exemplos e template](https://www.atlassian.com/br/agile/project-management/user-stories)
> - [Como escrever boas histórias de usuário (User Stories)](https://medium.com/vertice/como-escrever-boas-users-stories-hist%C3%B3rias-de-usu%C3%A1rios-b29c75043fac)
> - [User Stories: requisitos que humanos entendem](https://www.luiztools.com.br/post/user-stories-descricao-de-requisitos-que-humanos-entendem/)
> - [Histórias de Usuários: mais exemplos](https://www.reqview.com/doc/user-stories-example.html)
> - [9 Common User Story Mistakes](https://airfocus.com/blog/user-story-mistakes/)

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

| ID     | Descrição do Requisito | Prioridade |  
|--------|------------------------------------------------------------|----------|  
| RF-001 | O usuário deve poder cadastrar novos PANs.                 | MÉDIA    |  
| RF-002 | O sistema deve possuir um controle de permissões, incluindo perfis como administrador, articulador e visualizador. | ALTA    |  
| RF-003 | O sistema deve permitir a inserção de dados das ações dos PANs. | ALTA    |  
| RF-004 | O sistema deve exibir gráficos sobre o andamento das ações, incluindo métricas como porcentagem concluída, status (no prazo, em atraso, excluída), e recursos financeiros já gastos. | ALTA    |  
| RF-005 | O sistema deve permitir a espacialização das ações conforme seus recortes territoriais. | BAIXA    |  
| RF-006 | O sistema deve possibilitar a geração e impressão de um relatório em PDF sobre o andamento do PAN. | MÉDIA    |  
| RF-007 | O sistema deve enviar notificações por e-mail aos articuladores alertando sobre o vencimento de prazos e solicitando a atualização dos dados das ações. | MÉDIA    |

### Requisitos Não Funcionais  

| ID      | Descrição do Requisito                           | Prioridade |  
|---------|-----------------------------------------------|-----------|  
| RNF-001 | A aplicação será desenvolvida em HTML, CSS E JavaScript. | ALTA     | 
| RNF-002 | A aplicação será hospedada em ?????? | ALTA     |  
| RNF-003 | A aplicação deve ser responsiva e adaptável a diferentes dispositivos e tamanhos de tela. | MÉDIA     |  

Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |
|03| Não pode ser desenvolvido apoiando em um banco de dados|
|04| O projeto usará apenas HTML/Css/JavaScript            |
|05| Todo dado deve estar armazenado localmente por intermédio de um arquivo .Json|
|05| Armazenamento via localstorage|

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)
