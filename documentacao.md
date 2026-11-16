# Documentação do site

## Visão geral

Este repositório contém um site institucional para a 2ª Região da Paraíba da Ordem DeMolay. O frontend usa HTML, CSS e JavaScript nativos; o formulário é encaminhado pela função serverless em `api/indication.js`, executada na Vercel e conectada a um servidor SMTP.

## Executar localmente

O formulário depende da API, então use a Vercel CLI para executar o projeto completo localmente. A abertura de `index.html` por `file://` ou por um servidor estático simples não fornece a rota `/api/indication`.

Instale as dependências e inicie o servidor local:

```powershell
npm install
npx vercel dev
```

O comando pode solicitar que o projeto seja vinculado a uma conta Vercel. Para testar o envio local, copie `.env.example` para `.env.local` e configure as variáveis com os dados do provedor SMTP. Não compartilhe nem versione `.env.local`. Encerre o servidor com `Ctrl+C`.

Execute `npm test` para verificar a validação de dados e a política de origem. Tailwind CSS e as fontes Inter e Cinzel são obtidos de CDNs e precisam de conexão com a internet.

## Organização dos arquivos

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Conteúdo e estrutura das seções, navegação, filtros e campos do formulário. |
| `css/styles.css` | Regras CSS complementares para o padrão de fundo e a logo. |
| `js/main.js` | Inicializa os módulos após o carregamento do DOM. |
| `js/components/units.js` | Filtra e renderiza os cartões das organizações; cria links de busca do Google Maps. |
| `js/components/interest-form.js` | Atualiza a obrigatoriedade da idade, envia os dados à API e exibe estados de envio, sucesso ou erro. |
| `js/data/regional-units.js` | Fonte dos dados exibidos em cada cartão. |
| `js/tailwind.config.js` | Cores e famílias tipográficas personalizadas do tema Tailwind. |
| `api/indication.js` | Endpoint Vercel `POST /api/indication`; valida a solicitação e envia o email por SMTP. |
| `lib/indication.js` | Regras de validação dos dados e das origens permitidas. |
| `test/indication.test.js` | Testes unitários da validação e da política de origem. |
| `.env.example` | Modelo das variáveis de configuração; não contém credenciais válidas. |
| `assets/logo-2-regiao.png` | Imagem da identidade visual usada na navegação e no destaque principal. |

### Inicialização

O HTML carrega `js/main.js` com `type="module"`. O ponto de entrada aguarda `DOMContentLoaded` e então inicializa:

- `initializeUnits()`, que cria os cartões e associa os botões de filtro;
- `initializeInterestForm()`, que prepara os eventos do formulário.

## Seções da página

1. **Navegação e destaque:** identidade regional, gestão 2026/2027 e acesso ao formulário e ao portal nacional.
2. **Capítulos e organizações afiliadas:** cartões gerados a partir dos dados e filtros por cidade.
3. **Sobre a Ordem:** informações para jovens, famílias e o Clube de Mães e Amigos.
4. **Links oficiais:** portal do SCDB, perfil estadual e Instagram regional.
5. **Formulário de interesse:** dados de contato, cidade e perfil da pessoa interessada.
6. **Rodapé:** vínculo institucional, liderança regional e links finais.

## Dados das organizações

Os cartões usam os objetos exportados por `regionalUnits` em `js/data/regional-units.js`. Cada organização pode ter os seguintes campos:

- `name`: nome e número da organização;
- `type`: categoria exibida no cartão;
- `ageGroup`: faixa etária apresentada;
- `city` e `state`: usados para filtragem e localização textual;
- `regionLabel` (opcional): rótulo alternativo de localização;
- `badgeColor`: classes Tailwind para a etiqueta de categoria;
- `description`: texto descritivo;
- `mapsLocation`: texto usado como consulta na busca do Google Maps;
- `instaUrl`: endereço externo do Instagram.

Para incluir ou atualizar uma organização, edite o array em `js/data/regional-units.js`. Use o mesmo nome de cidade em `city` e no atributo `data-city` do botão correspondente em `index.html`; os filtros comparam esses valores literalmente. Se for adicionada uma cidade, atualize também as opções de cidade do formulário em `index.html`, quando aplicável.

O link do Maps é uma pesquisa criada com `mapsLocation`, não uma coordenada ou um pin verificado. Confira o resultado no Google Maps ao alterar endereços.

## Formulário e envio de email

O formulário coleta nome, perfil, idade (obrigatória para o perfil de jovem e opcional para os demais), cidade e email de contato. Exige autorização para encaminhar esses dados e orienta que um responsável preencha ou autorize o envio quando se tratar de um menor. O navegador envia uma requisição `POST` JSON à rota `/api/indication`.

O endpoint valida a origem da requisição, os campos e a autorização. Em seguida, envia o email com Nodemailer e aguarda a resposta do servidor SMTP antes de retornar sucesso. A aplicação não persiste os dados em banco nem registra o conteúdo do formulário nos logs.

### Configuração SMTP na Vercel

Configure estas variáveis no painel do projeto Vercel, para os ambientes que serão usados, e faça um novo deploy após alterá-las:

| Variável | Descrição |
| --- | --- |
| `SITE_URL` | Origem pública oficial do site, por exemplo `https://seu-dominio.vercel.app`, sem caminho. |
| `SMTP_HOST` | Host SMTP indicado pelo provedor de email. |
| `SMTP_PORT` | Use `465` (TLS implícito) ou `587` (STARTTLS). A porta `25` não é aceita. |
| `SMTP_USER` | Usuário SMTP. |
| `SMTP_PASS` | Senha SMTP ou senha de aplicativo fornecida pelo provedor. |
| `MAIL_FROM` | Endereço autenticado ou autorizado pelo provedor para envio. |
| `MAIL_TO` | Caixa que receberá as indicações; por padrão, `segundaregiaoadministrativapb@gmail.com`. |

O arquivo `.env.example` lista os nomes das variáveis. Para desenvolvimento local, copie-o para `.env.local`, substitua os exemplos por valores reais e execute `npx vercel dev`. Não coloque senhas no código, no Git ou em mensagens de chat. Se usar Gmail/Google Workspace, configure a autenticação SMTP apropriada (por exemplo, uma senha de app quando exigida) e use um remetente permitido pela conta.

`SITE_URL` protege o endpoint contra chamadas iniciadas de outros sites. Domínios de preview da Vercel também são aceitos pelo ambiente Vercel. Para domínios próprios, configure o endereço exato em `SITE_URL`.

### Confirmação e diagnóstico

A página informa sucesso somente depois que o servidor SMTP aceita a mensagem. Isso não garante que ela chegou à caixa de entrada: filtros de spam, rejeições posteriores, configuração SPF/DKIM/DMARC ou regras do provedor podem afetar a entrega. Confira também spam e quarentena. A função aguarda `sendMail` dentro da requisição; em caso de falha, retorna erro para a interface em vez de exibir uma confirmação falsa.

Se o envio falhar, confira:

1. As variáveis SMTP estão preenchidas no ambiente Vercel correto e o projeto foi redeployado.
2. Host, usuário e senha estão corretos; a porta corresponde à configuração do provedor (`465` ou `587`).
3. `MAIL_FROM` é permitido pelo provedor e `MAIL_TO` está correto.
4. Os logs da função `api/indication` na Vercel mostram um código de erro SMTP; a aplicação não registra o corpo nem os dados pessoais submetidos.

## Manutenção e publicação

- Mantenha os caminhos relativos entre HTML, módulos, CSS e imagens ao publicar.
- Publique na Vercel para que o site e a rota de API estejam disponíveis no mesmo domínio, com HTTPS.
- Os links para Maps e serviços sociais dependem dos serviços externos correspondentes.
- Após alterar cidades ou dados de organizações, confira os filtros, os cartões e cada link externo no navegador.
- A logo é usada em dois pontos de `index.html`; mantenha o caminho do arquivo atualizado caso a imagem seja substituída.
