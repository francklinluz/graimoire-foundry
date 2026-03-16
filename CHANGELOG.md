# Changelog — Graimoire Foundry Module

## [1.1.0] — 2026-03-16

### Adicionado
- **Controle de acesso por jogador**: GMs podem liberar individualmente quais jogadores têm permissão de usar `/graimoire`
- **Gerenciador de acesso**: botão "Gerenciar Acesso de Jogadores" nas configurações do módulo abre um dialog com checkboxes para cada jogador da mesa
- Jogadores bloqueados recebem mensagem privada no chat explicando que o recurso requer o plano Team, com link para o servidor

## [1.0.2] — 2026-03-16

### Adicionado
- Lógica de assinatura: verificação de plano (free/pro/team) integrada ao módulo
- Mensagem de limite atingido quando o plano free esgota as consultas mensais

## [1.0.1] — 2026-03-15

### Adicionado
- **Autenticação via API Key**: nova setting "API Key do Graimoire" nas configurações do módulo
- A chave é enviada no header `X-API-Key` em todas as requisições ao servidor
- Setting "ID do livro ativo" para selecionar qual livro indexado será consultado

## [1.0.0] — 2026-03-15

### Lançamento inicial
- Comando `/graimoire <pergunta>` no chat do Foundry
- Consulta ao backend Graimoire via `POST /api/foundry/query`
- Indicador de digitação animado enquanto aguarda a resposta
- Exibição da resposta com formatação (negrito, itálico) e citações de página
- Opção de mostrar respostas para todos os jogadores ou apenas para quem perguntou (whisper)
- Prompt de login quando a sessão não está autenticada
- Suporte a Foundry VTT v12+
