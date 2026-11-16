# Documentação do site

## Visão geral

Site estático feito com HTML, CSS e JavaScript nativos. Os cartões das organizações são carregados dos dados do projeto e filtrados no navegador. O formulário usa Netlify Forms para registrar indicações e encaminhar notificações por email, sem API própria ou credenciais SMTP no código.

## Publicar e ativar os formulários

1. Importe o repositório na Netlify. [`netlify.toml`](netlify.toml) configura a publicação da pasta raiz, sem comando de build.
2. No painel do site, abra **Forms** e clique em **Enable form detection**.
3. Faça um novo deploy. A Netlify analisa o HTML publicado e registra o formulário chamado `interest`.
4. Abra **Forms → Notifications** e crie uma notificação por email para `segundaregiaoadministrativapb@gmail.com`.
5. Se o email não pertencer a um membro da equipe Netlify, confirme a autorização pelo link enviado pela Netlify. Enquanto o destinatário estiver pendente, as notificações não serão enviadas.
6. Envie uma indicação de teste e confira **Forms → Submissions**, a caixa de entrada e a pasta de spam.

O recebimento e a notificação por email são etapas distintas: o envio pode aparecer em **Submissions**, mas a equipe só recebe email depois que a notificação estiver configurada e o destinatário confirmado. A ativação da detecção e a configuração da notificação precisam ser feitas no painel da conta Netlify; não podem ser habilitadas apenas por código.

Um servidor estático local, como `python -m http.server`, não executa o processamento Netlify. Portanto, o formulário não pode ser testado para entrega de email apenas abrindo o site localmente. Faça o teste em um deploy Netlify.

## Arquivos

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura da página, campos do formulário e atributos Netlify Forms. |
| `css/styles.css` | Estilos complementares para o fundo e a logo. |
| `js/main.js` | Inicializa os módulos quando o DOM está carregado. |
| `js/components/units.js` | Ordena e renderiza cartões, filtros e links do Maps. |
| `js/components/interest-form.js` | Ajusta o campo de idade e envia os dados codificados por AJAX. |
| `js/data/regional-units.js` | Dados das organizações afiliadas. |
| `js/tailwind.config.js` | Cores e fontes do tema Tailwind. |
| `assets/logo-2-regiao.png` | Logo regional. |
| `netlify.toml` | Diretório publicado pela Netlify. |

Tailwind CSS e as fontes Inter/Cinzel são carregados por CDN, então precisam de internet. Não há dependências npm nem etapa de build.

## Como o formulário funciona

O formulário HTML tem `name="interest"`, `method="POST"` e `data-netlify="true"`. Durante o deploy, a Netlify detecta a marcação e injeta o campo oculto `form-name`. O JavaScript também o acrescenta caso esteja ausente e converte `FormData` para `application/x-www-form-urlencoded`, formato exigido pelo processamento AJAX da Netlify Forms.

Os dados incluem nome, email, perfil, idade, cidade e autorização. A idade é obrigatória para o perfil de jovem e opcional para os demais. Um campo honeypot ajuda a filtrar robôs. O aviso de autorização informa que a Netlify processará os dados e que, para menores, o responsável deve preencher ou autorizar o envio.

As submissões ficam disponíveis no painel Netlify. O email de notificação é definido separadamente em **Forms → Notifications**; não há senha SMTP, API key ou email destinatário embutido no JavaScript.

## Manutenção

- Ao adicionar um campo, inclua um atributo `name` e mantenha o formulário detectável no HTML estático para que a Netlify o indexe durante o deploy.
- Se alterar o `name` do formulário, mantenha coerentes o nome usado pela página e o valor enviado como `form-name`.
- Depois de alterar os campos ou a marcação do formulário, faça deploy e confirme que ele aparece em **Forms**.
- Para mudar o destinatário, edite a notificação no painel e conclua a confirmação de endereço exigida pela Netlify.
- Para atualizar uma organização, edite `js/data/regional-units.js`; nomes de cidade precisam corresponder aos filtros em `index.html`.
