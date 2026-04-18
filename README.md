# NFL Draft Tracker (Prospectos)

Plataforma web simples para acompanhar prospectos do Draft da NFL.

## Funcionalidades

- Lista de prospectos com posição, escola e ranking.
- Filtros por nome, posição, escola e status.
- Status de cada jogador:
  - Disponível
  - Selecionado (com registro de round/escolha)
  - No board
- Board pessoal (adicionar/remover prospectos).
- Persistência local com `localStorage`.

## Como usar

1. Abra o arquivo `index.html` no navegador.
2. Use os filtros para encontrar os jogadores.
3. Clique em **Draftado** para registrar uma escolha.
4. Clique em **Adicionar/Remover** para montar seu board.

## Estrutura

- `index.html`: interface da aplicação.
- `styles.css`: estilos visuais.
- `script.js`: dados, filtros, renderização e persistência.
