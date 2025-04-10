# Especificações do Projeto

## Personas

1. Júlia, servidora do ICMBio, lotada na sede do ICMBio em Brasília, coordena todos os PANs executados pelo ICMBio. Júlia é responsável por definir quais PANs serão desenvolvidos. Júlia também precisa ter acesso aos dados de todos os PANs para tomada de decisão e, atualmente, precisa ficar abrindo as planilhas XLSX de cada PAN para acessar as informações, pois não há uma solução de tecnologia da informação que centralize tudo em uma única plataforma.

2. Márcio, servidor do ICMBio, é responsável por conduzir o PAN Cavernas do Brasil. Durante as oficinas de monitoria encontra dificuldades em preencher as planilhas em formato XLSX. Além disso, Márcio gasta muito tempo enviando e-mails aos articuladores solicitando o preenchimento de planilhas com as informações do andamento das ações e, depois, consolidando as respostas recebidas. 

3. Tenório, professor de universidade pública, é articulador de algumas ações do PAN Cavernas do Brasil. Em um momento pré-monitoria, recebe por e-mail uma planilha XLSX para atualizar as informações pertinentes às ações de que é responsável. Tenório preenche a planilha enviada por Márcio e responde ao e-mail com ela em anexo.

4. Jacinta é diretora no ICMBio e precisa de um relatório sobre o andamento do PAN Cavernas do Brasil para apresentar em uma reunião no Ministério do Meio Ambiente. Para tanto, solicita à Júlia que providencie este relatório. Júlia, por sua vez, solicita a Márcio a consolidação das informações. Márcio, então, consulta a planilha para gerar o relatório.

5. Alice é uma jornalista e precisa de informações sobre os recursos gastos nos PANS para compor os dados da sua matéria sobre porcentagem do PIB gasta em ações de conservação. No site do ICMBio, Alice tem que baixar todas as planilhas de todos os PANs e consultar uma a uma para fazer a consolidação dos dados.

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

| EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE`                                    | PARA ... `MOTIVO/VALOR`                                              |
|---------------------|-----------------------------------------------------------------------|----------------------------------------------------------------------|
| Administrador       | Criar, editar e desativar usuários                                    | Controlar o acesso ao sistema de forma segura                        | 
| Administrador       | Definir quais PANs serão desenvolvidos                                | Planejar e priorizar ações de conservação                            |
| Administrador       | Acessar dados consolidados de todos os PANs em um só lugar            | Tomar decisões sem precisar abrir múltiplas planilhas                |
| Coordenador         | Gerar relatórios gerenciais detalhados do PAN que é responsável       | Fornecer informações estratégicas para diretoria e ministérios       |
| Coordenador         | Cadastrar e atualizar ações no PAN Cavernas do Brasil                 | Manter atualizado o planejamento sem depender de planilhas           |
| Coordenador         | Solicitar atualizações dos articuladores via sistema                  | Automatizar o processo e reduzir tempo gasto enviando manualmente    |
| Coordenador         | Visualizar e consolidar informações enviadas pelos articuladores      | Ter um panorama atualizado para prestação de contas                  |
| Articulador         | Atualizar o andamento das ações sob sua responsabilidade via sistema  | Evitar o uso de e-mails e planilhas                                  |
| Usuário do sistema  | Acessar relatórios prontos e métricas atualizadas dos PANs            | Apresentar informações estratégicas em reuniões                      |
| Usuário do sistema  | Consultar dados de forma transparente dos PANs diretamente pelo site  | Agilizar o acesso às informações para múltiplas análises             |
| Usuário do sistema  | Filtrar dados por PANs, período, tipo de gasto e etc.                 | Encontrar rapidamente informações relevantes para múltiplas análises |

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

| ID     | Descrição do Requisito                                                                                                                                                                | Prioridade |  
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|  
| RF-001 |  O usuário deve poder cadastrar novos PANs.                                                                                                                                           |   ALTA     |
| RF-002 |  O sistema deve possuir um controle de permissões, incluindo perfis como administrador, coordenador, articulador e usuário do sistema.                                                |   ALTA     |
| RF-003 |  O sistema deve permitir que os responsáveis registrem e atualizem informações sobre as ações realizadas.                                                                             |   ALTA     |
| RF-004 |  O sistema deve apresentar dados sobre o andamento das ações, incluindo métricas como porcentagem concluída, status (no prazo, em atraso, excluída), e recursos financeiros já gastos.|   ALTA     |
| RF-005 |  O sistema deve permitir que os usuários filtrem as informações dos PANs por período, tipo de gasto, status e outros critérios.	                                                     |   ALTA     |
| RF-006 |  O sistema deve permitir que o administrador e o coordenador visualizem um painel consolidado com os dados das ações cadastradas.	                                                   |   ALTA     |
| RF-007 |  O sistema deve permitir que os articuladores atualizem o status das ações sob sua responsabilidade diretamente na plataforma.	                                                       |   ALTA     |
| RF-008 |  O sistema deve disponibilizar indicadores de desempenho das ações, como número de atividades concluídas e recursos utilizados.	                                                     |   ALTA     |
| RF-009 |  O sistema deve possibilitar a geração de relatórios sobre o andamento do PAN com opção de exportação para PDF e CSV.                                                                 |   MÉDIA    |
| RF-010 |  O sistema deve enviar notificações aos articuladores alertando sobre o vencimento de prazos e solicitando a atualização dos dados das ações.                                         |   MÉDIA    |
| RF-011 |  O sistema deve permitir a importação e exportação de dados para facilitar a atualização e compartilhamento de informações.        	                                                 |   MÉDIA    |
| RF-012 |  O sistema deve permitir que o administrador e o coordenador acessem um histórico de alterações feitas nos dados dos PANs.	                                                           |   MÉDIA    |
| RF-013 |  O sistema deve permitir a pesquisa por palavras-chave nos dados dos PANs.	                                                                                                           |   MÉDIA    |
| RF-014 |  O sistema deve armazenar os dados temporariamente no dispositivo do usuário para possibilitar acesso offline.                                                                        |   MÉDIA    |
| RF-015 |  O sistema deve permitir a espacialização das ações conforme seus recortes territoriais.                                                                                              |   BAIXA    |

### Requisitos Não Funcionais  

| ID      | Descrição do Requisito                                                                    | Prioridade |  
|---------|-------------------------------------------------------------------------------------------|------------|  
| RNF-001 | A aplicação será desenvolvida em HTML, CSS E JavaScript.                                  | ALTA       | 
| RNF-002 | A aplicação será hospedada em servidor no Brasil                                          | ALTA       |  
| RNF-003 | A aplicação deve ser responsiva e adaptável a diferentes dispositivos e tamanhos de tela. | MÉDIA      |  

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |
|03| Não pode ser desenvolvido apoiando em um banco de dados|
|04| O projeto usará apenas HTML/Css/JavaScript            |
|05| Todo dado deve estar armazenado localmente por intermédio de um arquivo Json|
|06| Armazenamento via localstorage|
