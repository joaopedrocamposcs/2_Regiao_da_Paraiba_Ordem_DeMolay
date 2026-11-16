# Documentação do site

## Visão geral

Este repositório contém um site institucional estático para a 2ª Região da Paraíba da Ordem DeMolay. O conteúdo é renderizado no navegador com HTML, CSS e JavaScript nativos, sem backend, gerenciador de pacotes ou processo de compilação.

## Executar localmente

Os arquivos JavaScript são carregados como módulos ES. Por isso, sirva o diretório por HTTP; a abertura de `index.html` pelo protocolo `file://` pode impedir que os módulos sejam carregados.

No PowerShell, na pasta do projeto, execute:

```powershell
py -m http.server 8000
```

Visite <http://localhost:8000>. Encerre o servidor com `Ctrl+C`. Como alternativa, use uma extensão de servidor local no Visual Studio Code ou um servidor estático equivalente.

Não há comandos de build, teste ou instalação de dependências definidos pelo projeto. Tailwind CSS e as fontes Inter e Cinzel são obtidos de CDNs e precisam de conexão com a internet.

## Organização dos arquivos

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Conteúdo e estrutura das seções, navegação, filtros e campos do formulário. |
| `css/styles.css` | Regras CSS complementares para o padrão de fundo e a logo. |
| `js/main.js` | Inicializa os módulos após o carregamento do DOM. |
| `js/components/units.js` | Filtra e renderiza os cartões das organizações; cria links de busca do Google Maps. |
| `js/components/interest-form.js` | Atualiza a obrigatoriedade da idade, valida o formulário e prepara o rascunho do email. |
| `js/data/regional-units.js` | Fonte dos dados exibidos em cada cartão. |
| `js/tailwind.config.js` | Cores e famílias tipográficas personalizadas do tema Tailwind. |
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

## Formulário e contato

O formulário coleta nome, perfil, idade (obrigatória para o perfil de jovem e opcional para os demais), cidade e email de contato. Ao enviar, o JavaScript monta um link `mailto:` para `segundaregiaoadministrativapb@gmail.com`, incluindo os dados no corpo da mensagem e usando um assunto predefinido, além de mostrar uma tela de confirmação.

Esse fluxo **não envia a solicitação automaticamente** nem armazena os dados no site. O navegador abre um rascunho no aplicativo de email configurado; a pessoa precisa revisar e confirmar o envio. Para automatizar o recebimento, seria necessário integrar um serviço de backend ou formulário externo, o que não existe nesta versão.

O email destinatário é definido pela constante `regionalEmail` em `js/components/interest-form.js`.

## Manutenção e publicação

- Mantenha os caminhos relativos entre HTML, módulos, CSS e imagens ao publicar.
- Sirva `index.html` como página inicial em uma hospedagem estática com suporte a HTTPS.
- Os links para Maps e serviços sociais dependem dos serviços externos correspondentes.
- Após alterar cidades ou dados de organizações, confira os filtros, os cartões e cada link externo no navegador.
- A logo é usada em dois pontos de `index.html`; mantenha o caminho do arquivo atualizado caso a imagem seja substituída.
