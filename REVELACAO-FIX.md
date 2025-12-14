# Sistema Completo de Rastreamento de Revelações

## Problema Original
Mesmo após o usuário já ter visto quem ele tirou no sorteio, a página de administração continuava mostrando "Aguardando revelação" para todos os participantes.

## Causa
O banco de dados não estava rastreando quando um participante visualizava sua revelação. A função `get_my_match` apenas retornava o nome do amigo secreto, mas não registrava que o participante havia visto.

## Solução Implementada

### Funcionalidades Adicionadas
1. ✅ Rastreamento de primeira visualização
2. ✅ Contagem total de visualizações
3. ✅ Histórico completo de acessos com:
   - Data e hora de cada acesso
   - Endereço IP
   - User Agent completo
   - Informações do dispositivo (Browser, OS, Tipo)
4. ✅ Interface admin com modal de detalhes

### 1. Banco de Dados
Execute o arquivo `fix-revelation-tracking.sql` no SQL Editor do Supabase Dashboard. Este script irá:

**Tabela `revelation_logs`** (nova):
- Armazena cada visualização com timestamp, IP, user agent e device info
- Permite histórico completo de acessos

**Atualização na tabela `participants`**:
- `revealed_at`: timestamp da primeira visualização
- `view_count`: contador total de visualizações

**Funções RPC atualizadas**:
1. `get_my_match`: foram atualizados:

**src/types.ts**:
- Interface `Participant`: adicionados `revealed_at` e `view_count`
- Interface `RevelationLog` (nova): estrutura dos logs de visualização

**src/lib/supabase-helpers.ts**:
- Função `getMyMatch`: agora envia user agent e device info
- Função `getRevelationLogs` (nova): busca logs de um participante
- Função `getDeviceInfo`: detecta browser, OS e tipo de dispositivo

**src/routes/admin.$token.tsx**:
- Lista de participantes agora é clicável (quando já visualizou)
- Mostra contador de visualizações ao lado do status
- Modal completo com:
  - Estatísticas (total de views e primeira visualização)
  - Lista de todos os acessos com data/hora
  - Informações de dispositivo para cada acesso
  - IP de cada acesso
  - User Agent completo (expansível)
2. `get_participants_by_admin_token`:
   - Retorna `revealed_at` e `view_count`

3. `get_revelation_logs` (nova):
   - Retorna histórico completo de visualizações de um participante

### Fluxo de Visualização
1. Usuário acessa `/reveal/$token`
2. Frontend detecta browser, OS e tipo de dispositivo
3. Função `get_my_match` é chamada com:
   - Token público
   - User Agent
   - Device Info (browser, OS, tipo)
4. Backend registra:
   **Execute o script SQL no Supabase**
   - Vá para SQL Editor no dashboard do Supabase
   - Cole o conteúdo de `fix-revelation-tracking.sql`
   - Execute o script

2. **Teste básico de visualização**
   - Acesse a página de administração
   - Escolha um participante que ainda não viu
   - Acesse a página de revelação com o token desse participante
   - Volte para a página de administração
   - Verifique: status deve mostrar "✅ Já visualizou - 1 vez"

3. **Teste de múltiplas visualizações**
   - Acesse a página de revelação novamente
   - Volte para admin
   - Contador deve incrementar: "✅ Já visualizou - 2 vezes"

4. **Teste do modal de logs**
   - Na página admin, clique no participante que já visualizou
   - Modal deve abrir mostrando:
     - Total de visualizações
     - Data da primeira visualização
     - Lista completa de acessos com detalhes

5. **Teste de diferentes dispositivos**
   - Acesse de diferentes dispositivos/browsers
   - Verifique no modal que cada acesso mostra:
     - Browser correto (Chrome, Firefox, Safari, Edge)
     - OS correto (Windows, macOS, Linux, Android, iOS)
     - Tipo correto (Desktop, Mobile, Tablet)

## Observações Técnicas

- `revealed_at` registra **apenas a primeira visualização**
- `view_count` incrementa a **cada acesso**
- Cada acesso gera um registro em `revelation_logs`
- IP address pode ser `null` (depende da configuração do Supabase)
- Device info é detectado no frontend via User Agent
- Participantes antigos terão `revealed_at = null` e `view_count = 0` até o primeiro acesso

## Segurança e Privacy

- Logs são protegidos por RLS (Row Level Security)
- Acesso apenas via RPCs com `SECURITY DEFINER`
- IPs não são expostos publicamente, apenas para admins
- User Agents completos ficam ocultos por padrão (expansível)
3. User Agent completo disponível em detalhes expansíveis
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
