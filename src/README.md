# Sistema de Monitoramento de PANs

## Sobre o Projeto
Sistema web para monitoramento dos Planos de Ação Nacional (PANs) do ICMBio, permitindo o acompanhamento do progresso das ações e gestão dos usuários envolvidos.

## Instalação do Site

O site em HTML/CSS/JS é um projeto estático, podendo ser utilizado em servidores HTTP ou localmente. Para iniciar:

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador web moderno
3. Para desenvolvimento, recomenda-se usar um servidor local (como Live Server do VS Code)

## Funcionalidades Principais

- Dashboard com visualização do progresso dos PANs
- Sistema de autenticação de usuários
- Gestão de usuários (administrador)
- Visualização detalhada das ações dos PANs
- Gráficos interativos de acompanhamento

## Tecnologias Utilizadas

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (Vanilla)
- Armazenamento Local (LocalStorage)

## Histórico de versões

## [1.0.0] - 14/04/2025
### Adicionado
- Sistema de autenticação com diferentes níveis de acesso
- Dashboard principal com gráficos de progresso
- Painel administrativo para gestão de usuários
- Interface responsiva com Tailwind CSS
- Visualização detalhada do PAN Cavernas

## [1.0.1] - 27/04/2025
### Adicionado
- Exibição dinâmica dos cards de PANs via JavaScript, utilizando dados de um arquivo JSON.

## [1.0.2] - 29/04/2025
### Alterado
- Cálculo da porcentagem de conclusão dos objetivos agora baseado nos status das ações.
- Exibição dos gráficos atualizada para coletar dinamicamente os dados dos PANs a partir do JSON, removendo o código estático.

### Adicionado
- Status individual para cada ação.
- Definição dinâmica da tag dos PANs conforme o progresso.