# 2ª Região da Paraíba — Ordem DeMolay

Site institucional estático da 2ª Região da Paraíba. Apresenta as organizações afiliadas, informações da Ordem, canais oficiais e um formulário de interesse.

## Publicar na Netlify

O formulário usa Netlify Forms; não precisa de servidor SMTP, API própria ou dependências npm. Para ativar:

1. Importe este repositório na Netlify. O arquivo [`netlify.toml`](netlify.toml) define a pasta raiz como publicação.
2. No painel do site, abra **Forms** e selecione **Enable form detection**.
3. Faça um deploy depois de ativar a detecção para a Netlify reconhecer o formulário.
4. Em **Forms → Notifications**, crie uma notificação por email para `segundaregiaoadministrativapb@gmail.com`. Se solicitado, confirme o endereço pelo email enviado pela Netlify.
5. Envie uma indicação de teste e confira **Forms → Submissions** e a caixa de entrada/spam.

O formulário só pode ser recebido depois que o site estiver publicado na Netlify com a detecção ativada. Um servidor estático local, como `python -m http.server`, serve a página, mas não processa envios.

## Estrutura

- [`index.html`](index.html): conteúdo da página e marcação reconhecida pela Netlify Forms.
- [`css/styles.css`](css/styles.css): estilos complementares e logo.
- [`js/main.js`](js/main.js): inicialização dos módulos.
- [`js/components/units.js`](js/components/units.js): cartões das organizações e filtros.
- [`js/components/interest-form.js`](js/components/interest-form.js): envio AJAX do formulário e mensagens de estado.
- [`js/data/regional-units.js`](js/data/regional-units.js): dados das organizações, cidades e links.
- [`js/tailwind.config.js`](js/tailwind.config.js): tema do Tailwind CSS.
- [`assets/logo-2-regiao.png`](assets/logo-2-regiao.png): logo regional.
- [`documentacao.md`](documentacao.md): arquitetura e instruções detalhadas de configuração.

Tailwind CSS e as fontes Inter e Cinzel vêm de CDNs e precisam de conexão com a internet. O projeto não requer `npm install` ou etapa de build.
