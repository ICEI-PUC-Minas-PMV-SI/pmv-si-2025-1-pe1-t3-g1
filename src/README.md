# Sistema de Monitoramento de PANs

## Sobre o Projeto
Sistema web desenvolvido para monitoramento dos Planos de Ação Nacional (PANs) do ICMBio, possibilitando o acompanhamento eficiente do progresso das ações e gerenciamento dos usuários envolvidos.

## Instalação do Sistema

O sistema web foi desenvolvido utilizando HTML/CSS/JS como um projeto estático, podendo ser implementado em servidores HTTP ou executado localmente. Para iniciar:

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador web moderno
3. Para desenvolvimento, recomenda-se utilizar um servidor local (como Live Server do VS Code)

## Funcionalidades Principais

- Dashboard interativo com visualização do progresso dos PANs
- Sistema robusto de autenticação de usuários
- Gerenciamento avançado de usuários (administrador)
- Visualização detalhada e intuitiva das ações dos PANs
- Gráficos interativos para acompanhamento em tempo real

## Tecnologias Utilizadas

- HTML5
- CSS3 (Framework Tailwind CSS)
- JavaScript (Vanilla)
- Armazenamento Local (LocalStorage)

## Histórico de Versões

### [1.0.0] - 14/04/2025
#### Adicionado
- Sistema de autenticação com diferentes níveis de acesso
- Dashboard principal com gráficos de progresso
- Painel administrativo para gestão de usuários
- Interface responsiva com Tailwind CSS
- Visualização detalhada do PAN Cavernas

### [1.0.1] - 27/04/2025
#### Adicionado
- Exibição dinâmica dos cards de PANs via JavaScript, utilizando dados de um arquivo JSON

### [1.0.2] - 29/04/2025
#### Alterado
- Aprimoramento no cálculo da porcentagem de conclusão dos objetivos, baseado nos status das ações
- Atualização da exibição dos gráficos para coleta dinâmica dos dados dos PANs via JSON

#### Adicionado
- Status individual para cada ação
- Definição dinâmica da tag dos PANs conforme o progresso

### [1.0.3] - 04/05/2025
#### Adicionado
- CRUD completo para inserção e manipulação de dados

### [1.0.4] - 07/05/2025
#### Adicionado
- Validação de permissões para diferentes papéis de usuário
- Integração com API ViaCEP
- Implementação de API de geolocalização

### [1.0.5] - 12/05/2025
#### Corrigido
- Resolução do problema de persistência ao deletar PANs

#### Adicionado
- Implementação do arquivo utils.js para otimização de funções recorrentes

### [1.0.6] - 20/05/2025
#### Adicionado
- Implementação de casos de teste

### [1.0.7] - 24/05/2025
#### Adicionado
- Funcionalidade para articuladores editarem suas próprias ações vinculadas

### [1.0.8] - 27/05/2025
#### Adicionado
- Sistema de paginação na visualização de PANs
- Disponibilização do sistema via GitHub Pages

### [1.0.9] - 07/06/2025
#### Adicionado
- Implementação de testes unitários
- Desenvolvimento de testes automatizados

### [1.0.10] - 08/06/2025
#### Adicionado
- Disponibilização dos resultados de testes
- Implementação da funcionalidade de exportação de dados dos PANs
