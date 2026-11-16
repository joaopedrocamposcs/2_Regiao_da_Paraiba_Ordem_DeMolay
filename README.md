# 2ª Região da Paraíba — Ordem DeMolay

Site institucional estático da 2ª Região da Paraíba, vinculada ao Grande Conselho Estadual da Paraíba (GCE-PB) e ao Supremo Conselho DeMolay Brasil (SCDB). Apresenta as organizações afiliadas, informações institucionais, canais oficiais e um formulário de interesse.

## Como visualizar

O projeto não possui etapa de build nem dependências locais. Como os scripts JavaScript usam módulos ES, abra o site por um servidor HTTP em vez de abrir o arquivo `index.html` diretamente.

Uma opção é iniciar o servidor simples do Python na pasta do projeto:

```powershell
py -m http.server 8000
```

Depois, acesse <http://localhost:8000>. Se o comando `py` não estiver disponível, use uma extensão de servidor local no Visual Studio Code ou outro servidor HTTP estático.

Tailwind CSS e as fontes do Google Fonts são carregados de serviços externos; para que esses recursos apareçam, o navegador precisa de conexão com a internet.

## Estrutura

- [`index.html`](index.html): estrutura e conteúdo das seções da página.
- [`css/styles.css`](css/styles.css): estilos complementares, incluindo a apresentação da logo.
- [`js/main.js`](js/main.js): ponto de entrada que inicializa os módulos da página.
- [`js/components/units.js`](js/components/units.js): cartões das organizações e filtros por cidade.
- [`js/components/interest-form.js`](js/components/interest-form.js): comportamento do formulário e criação do rascunho de email.
- [`js/data/regional-units.js`](js/data/regional-units.js): dados das organizações, cidades, endereços de busca no Maps e Instagrams.
- [`js/tailwind.config.js`](js/tailwind.config.js): tema Tailwind usado pela página.
- [`assets/logo-2-regiao.png`](assets/logo-2-regiao.png): logo regional.
- [`documentacao.md`](documentacao.md): arquitetura, comportamentos e instruções para manutenção.

## Conteúdo atual

O site lista seis organizações em Campina Grande, Areia, Alagoa Grande e Picuí. Os cartões são gerados a partir dos dados em `js/data/regional-units.js`; os botões da página filtram esses cartões por cidade.

O formulário não envia dados a um servidor. Após o preenchimento, ele prepara um link `mailto:` endereçado a `segundaregiaoadministrativapb@gmail.com`. A pessoa deve abrir o rascunho, revisar os dados e confirmar o envio no aplicativo de email.

## Publicação

Publique os arquivos do projeto em qualquer hospedagem de site estático que sirva `index.html` e preserve a estrutura de pastas. Não renomeie ou mova os arquivos referenciados no HTML e nos módulos sem atualizar também os respectivos caminhos.
