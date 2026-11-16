# 2ª Região da Paraíba — Ordem DeMolay

Site institucional da 2ª Região da Paraíba, vinculada ao Grande Conselho Estadual da Paraíba (GCE-PB) e ao Supremo Conselho DeMolay Brasil (SCDB). Apresenta as organizações afiliadas, informações institucionais, canais oficiais e um formulário de interesse. O frontend é estático e o envio do formulário usa uma função serverless da Vercel com SMTP.

## Como visualizar

Como o formulário chama uma API, use o ambiente de desenvolvimento da Vercel para testar o site completo. Também é necessário configurar as variáveis SMTP antes de enviar indicações.

Instale as dependências e inicie o ambiente local:

```sh
npm install
npx vercel dev
```

O comando `vercel dev` pode solicitar que você vincule o projeto à sua conta Vercel. Configure os valores de `.env.example` em `.env.local` para desenvolvimento local; nunca compartilhe ou versione as credenciais. Acesse o endereço informado pelo comando.

Tailwind CSS e as fontes do Google Fonts são carregados de serviços externos, então o navegador precisa de internet.

## Estrutura

- [`index.html`](index.html): estrutura e conteúdo das seções da página.
- [`css/styles.css`](css/styles.css): estilos complementares, incluindo a apresentação da logo.
- [`js/main.js`](js/main.js): ponto de entrada que inicializa os módulos da página.
- [`js/components/units.js`](js/components/units.js): cartões das organizações e filtros por cidade.
- [`js/components/interest-form.js`](js/components/interest-form.js): envio do formulário à API e feedback para a pessoa usuária.
- [`js/data/regional-units.js`](js/data/regional-units.js): dados das organizações, cidades, endereços de busca no Maps e Instagrams.
- [`js/tailwind.config.js`](js/tailwind.config.js): tema Tailwind usado pela página.
- [`api/indication.js`](api/indication.js): valida e envia as indicações por SMTP na Vercel.
- [`lib/indication.js`](lib/indication.js): validação dos dados e das origens permitidas.
- [`assets/logo-2-regiao.png`](assets/logo-2-regiao.png): logo regional.
- [`documentacao.md`](documentacao.md): arquitetura, comportamentos e instruções para manutenção.

## Conteúdo atual

O site lista seis organizações em Campina Grande, Areia, Alagoa Grande e Picuí. Os cartões são gerados a partir dos dados em `js/data/regional-units.js`; os botões da página filtram esses cartões por cidade.

O formulário envia os dados para a API e esta encaminha uma mensagem via SMTP para `segundaregiaoadministrativapb@gmail.com`. O envio só é confirmado na página após o servidor SMTP aceitar a mensagem; credenciais e endereço remetente devem ser configurados na Vercel.

Execute os testes de validação com `npm test`.

## Publicação

Publique o repositório na Vercel para disponibilizar tanto o site quanto a rota `/api/indication`. Configure as variáveis de ambiente documentadas em [documentacao.md](documentacao.md) no painel da Vercel. Hospedar apenas os arquivos estáticos não disponibiliza a API de envio.
