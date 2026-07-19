# Meta Checker

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md)

**Seu parceiro de metadados para GEO e SEO.**

Meta Checker é uma extensão do Chrome que compara os metadados do DOM atual com
a resposta HTML original. Ela ajuda você a entender o que mecanismos de busca e
rastreadores de IA podem encontrar e a identificar rapidamente valores adicionados,
alterados ou removidos após o carregamento da página.

[Instalar pela Chrome Web Store](https://chromewebstore.google.com/detail/metadata-extractor/pdikiboojnhoacoknfdpndeddocnbmop)

![Comparação de metadados do Meta Checker](docs/images/meta-checker-overview.png)

![Guia de estados do Meta Checker](docs/images/meta-checker-state-guide.png)

## O que você pode inspecionar

- Título da página, meta título, meta descrição e URL canônica
- Título, descrição, tipo, nome do site, URL e imagem do Open Graph
- Diretivas robots, idioma do documento e links de idiomas alternativos
- Status HTTP, URL final, redirecionamentos, tipo de conteúdo e `X-Robots-Tag`
- Quantidade de blocos JSON-LD, erros de validação e valores `@type` detectados
- Tag original completa por meio do botão de código

Você pode recolher seções e escolher seções inteiras ou campos individuais nas
configurações de exibição. A interface oferece suporte a inglês, coreano, japonês,
espanhol e português do Brasil.

## Estados dos metadados

| Estado | Significado |
| --- | --- |
| `Same` | O DOM atual corresponde à resposta HTML original. |
| `New` | O valor existe no DOM atual, mas não na resposta original. |
| `Changed` | O valor do DOM atual é diferente do valor da resposta original. |
| `Removed` | O valor existe na resposta original, mas não no DOM atual. |

Clique em qualquer chip de estado ou no botão `?` no canto superior direito para
abrir o guia de estados.

## Como usar

1. Abra uma página comum que você deseja inspecionar.
2. Inicie o Meta Checker pela barra de ferramentas do Chrome.
3. Confira os valores de metadados e seus chips de estado.
4. Use o botão de código para ver a tag original completa.
5. Escolha as seções e os campos visíveis nas configurações.
6. Selecione o idioma da interface no menu de idiomas.

Depois de instalar ou recarregar a extensão descompactada, atualize as páginas que
já estavam abertas antes de iniciar o Meta Checker. O Chrome não injeta o novo
script de conteúdo nas abas abertas antes do carregamento da extensão.

## Instalação local

1. Baixe ou clone este repositório.
2. Abra `chrome://extensions` no Chrome.
3. Ative o **Modo do desenvolvedor**.
4. Selecione **Carregar sem compactação**.
5. Escolha a pasta raiz que contém o arquivo `manifest.json`.
6. Fixe o Meta Checker no menu de extensões da barra de ferramentas.

## Versão

Versão atual: `1.1.0`
