# Correção: Rastreamento de Revelação

## Problema
Mesmo após o usuário já ter visto quem ele tirou no sorteio, a página de administração continuava mostrando "Aguardando revelação" para todos os participantes.

## Causa
O banco de dados não estava rastreando quando um participante visualizava sua revelação. A função `get_my_match` apenas retornava o nome do amigo secreto, mas não registrava que o participante havia visto.

## Solução

### 1. Banco de Dados
Execute o arquivo `fix-revelation-tracking.sql` no SQL Editor do Supabase Dashboard. Este script irá:

- Adicionar a coluna `revealed_at` na tabela `participants` para registrar quando o usuário viu pela primeira vez
- Atualizar a função `get_my_match` para registrar o timestamp quando o usuário acessa a página de revelação
- Atualizar a função `get_participants_by_admin_token` para retornar o campo `revealed_at`

```bash
# Cole o conteúdo de fix-revelation-tracking.sql no SQL Editor do Supabase
```

### 2. Código Frontend
Os seguintes arquivos já foram atualizados:

- **src/types.ts**: Adicionado campo `revealed_at: string | null` na interface `Participant`
- **src/routes/admin.$token.tsx**: Atualizado para mostrar:
  - ✅ "Já visualizou" (em verde) quando `revealed_at` não é null
  - ⏰ "Aguardando revelação" (em cinza) quando `revealed_at` é null

## Como Funciona

1. Quando um usuário acessa a página `/reveal/$token` pela primeira vez, a função `get_my_match` é chamada
2. A função registra o timestamp em `revealed_at` (apenas na primeira vez)
3. Na página de administração, o status é exibido baseado nesse campo:
   - Se `revealed_at` tem valor → "Já visualizou" ✅
   - Se `revealed_at` é null → "Aguardando revelação" ⏰

## Testando

1. Execute o script SQL no Supabase
2. Acesse a página de administração
3. Escolha um participante que ainda não viu
4. Acesse a página de revelação com o token desse participante
5. Volte para a página de administração
6. O status deve mudar de "Aguardando revelação" para "Já visualizou"

## Observações

- O campo `revealed_at` só é atualizado na **primeira vez** que o usuário vê a revelação
- Se o usuário acessar a página múltiplas vezes, o timestamp permanece o mesmo da primeira visualização
- Participantes criados antes desta atualização terão `revealed_at = null` até acessarem a página de revelação
