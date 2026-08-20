# QuestionsPreparaBot

# Qap — Gabarito Automático

Painel flutuante em JavaScript para **detectar questões e alternativas presentes em uma página**, identificar a alternativa marcada como correta nos dados disponíveis no `window` e auxiliar na navegação entre as questões.

O script cria uma interface visual sobre a página com tema escuro, roxo e animações, permitindo visualizar o enunciado, as alternativas, a resposta identificada e navegar pelas questões.

> **Aviso:** este projeto é destinado a fins educacionais, testes de automação e desenvolvimento. O uso em plataformas de avaliações pode violar regras acadêmicas ou termos de serviço.

---

## ✨ Funcionalidades

* 🔎 Busca recursiva por questões dentro de `window`.
* 🧠 Detecção automática de estruturas contendo:

  * `id`
  * `answers`
  * `text`
  * `fraction`
* ✅ Identificação da alternativa considerada correta através de `fraction`.
* 🎯 Tentativa de localizar a alternativa correspondente diretamente na página.
* 🖱️ Destaque visual da alternativa detectada.
* ▶️ Modo **Auto responder**.
* ⏭️ Navegação automática entre questões.
* ⬅️ Botões de questão anterior/próxima.
* ⌨️ Navegação utilizando as setas do teclado.
* 📊 Barra de progresso.
* 🗂️ Contador de questões.
* 📌 Painel arrastável pela tela.
* ➖ Minimização do painel.
* ✕ Fechamento do painel.
* 🎨 Interface totalmente criada via JavaScript e CSS.
* 💫 Animações de entrada, saída, brilho e carregamento.
* 🧹 Remoção automática de instâncias anteriores do painel.

---

## 🖥️ Interface

Ao executar o script, é criado um painel no canto inferior direito da página.

A interface apresenta:

```text
┌──────────────────────────────┐
│ ● GABARITO       10 questões │
├──────────────────────────────┤
│ ENUNCIADO                     │
│ Texto da questão...           │
│                               │
│ A  Alternativa 1         ✗   │
│ B  Alternativa 2         ✓   │
│ C  Alternativa 3         ✗   │
│ D  Alternativa 4         ✗   │
│                               │
│      ▶ AUTO RESPONDER         │
│                               │
├──────────────────────────────┤
│ ← Anterior   3 / 10   Próxima│
│          ━━━━━━━              │
└──────────────────────────────┘
```

---

## 🔍 Como funciona

O funcionamento pode ser dividido em cinco etapas principais.

### 1. Limpeza

Antes de iniciar, o script remove possíveis versões anteriores dos elementos:

```javascript
QapRoot
QapStyle
QapSplash
QapSplashStyle
```

Isso evita que múltiplos painéis sejam criados ao executar o código novamente.

---

### 2. Busca das questões

O script executa:

```javascript
const Found = DeepSearch(window);
```

A função `DeepSearch()` percorre recursivamente os objetos disponíveis em `window`.

Ela procura estruturas que contenham um array de questões ou uma estrutura que já possua o formato esperado.

A validação principal é feita por:

```javascript
function IsValidQuestions(Arr) {
    return Array.isArray(Arr) &&
        Arr.length > 0 &&
        Arr[0].id != null &&
        Arr[0].answers != null;
}
```

Um formato mínimo esperado é semelhante a:

```javascript
[
    {
        id: 1,
        text: "Qual é a resposta correta?",
        answers: [
            {
                text: "Alternativa A",
                fraction: 0
            },
            {
                text: "Alternativa B",
                fraction: 1
            }
        ]
    }
]
```

---

## ✅ Identificação da resposta

A alternativa correta é determinada através da propriedade `fraction`.

O código considera correta uma alternativa quando:

```javascript
Answer.fraction === 1 || Answer.fraction > 0
```

Portanto, uma estrutura como:

```javascript
{
    text: "Alternativa correta",
    fraction: 1
}
```

será exibida como correta.

Alternativas com:

```javascript
fraction: 0
```

serão exibidas como incorretas.

---

## 🎯 Detecção da alternativa na página

Depois de identificar a resposta correta nos dados, o script tenta encontrar o elemento correspondente no DOM.

Primeiramente são pesquisados elementos como:

```css
[data-slot="card"]
[class*="card"]
[role="radio"]
[role="option"]
```

Depois, são procurados elementos clicáveis:

```css
button
[class*="option"]
[class*="alternative"]
[class*="answer"]
[class*="choice"]
label
```

A comparação é feita utilizando o texto da resposta.

Quando o elemento é encontrado, ele recebe um destaque visual:

```javascript
outline: 2.5px solid #7F77DD;
```

e:

```javascript
box-shadow:
    0 0 0 5px rgba(83,74,183,0.22),
    0 0 24px rgba(127,119,221,0.3);
```

---

## ▶️ Auto responder

O botão:

```text
▶ Auto responder
```

ativa o modo automático.

O fluxo é aproximadamente:

```text
Detectar resposta
       ↓
Localizar alternativa na página
       ↓
Clicar na alternativa
       ↓
Aguardar
       ↓
Avançar para próxima questão
       ↓
Repetir
```

O intervalo principal é definido por:

```javascript
const AutoDelay = 1800;
```

Ou seja, o script utiliza aproximadamente **1,8 segundo** como intervalo de referência entre as etapas.

---

## ⏭️ Navegação

É possível navegar manualmente usando:

```text
← Anterior
Próxima →
```

Também são suportadas as teclas:

```text
←
→
↑
↓
```

A função responsável é:

```javascript
Navigate(Dir)
```

---

## 🖱️ Painel arrastável

O cabeçalho do painel pode ser utilizado para mover a interface.

O script registra:

```javascript
mousedown
mousemove
mouseup
```

e altera dinamicamente:

```javascript
Root.style.left
Root.style.top
```

Isso permite posicionar o painel em qualquer região da tela.

---

## ➖ Minimização

O botão `─` alterna entre os estados:

```text
─
```

e:

```text
□
```

Quando minimizado, o corpo e o rodapé são ocultados.

---

## 🛠️ Configuração

A principal configuração disponível atualmente é:

```javascript
const Labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const AutoDelay = 1800;
```

### `Labels`

Define os rótulos exibidos para as alternativas.

Exemplo:

```javascript
const Labels = ['A', 'B', 'C', 'D', 'E'];
```

### `AutoDelay`

Define o atraso utilizado pelo modo automático.

Exemplo:

```javascript
const AutoDelay = 3000;
```

Nesse caso, o intervalo de referência passa a ser aproximadamente 3 segundos.

---

## 📦 Estrutura esperada dos dados

O script não depende de uma variável global com nome específico.

Em vez disso, ele procura recursivamente por uma estrutura compatível.

Exemplo:

```javascript
window.algumObjeto = {
    quiz: {
        questions: [
            {
                id: 1,
                text: "Pergunta exemplo",
                answers: [
                    {
                        text: "Resposta A",
                        fraction: 0
                    },
                    {
                        text: "Resposta B",
                        fraction: 1
                    }
                ]
            }
        ]
    }
};
```

A função `DeepSearch()` consegue encontrar esse array mesmo estando dentro de objetos aninhados.

---

## ⚠️ Limitações

A detecção das alternativas depende da estrutura HTML da página.

Por isso, o script pode não funcionar corretamente quando:

* as alternativas não possuem texto diretamente no DOM;
* o conteúdo é renderizado dentro de Shadow DOM;
* a página utiliza componentes altamente customizados;
* o texto exibido é diferente do texto armazenado nos dados;
* as alternativas são carregadas dinamicamente depois da execução;
* a aplicação utiliza mecanismos que impedem `.click()`;
* a estrutura de dados não possui `id`, `answers` ou `fraction`.

Além disso, a função de busca utiliza:

```javascript
for (const Key in Obj)
```

para percorrer objetos. Em páginas muito complexas, isso pode resultar em uma busca relativamente pesada.

---

## 🔐 Segurança

O script executa diretamente no contexto da página e possui acesso aos objetos disponíveis em `window` e ao DOM.

Por isso:

* execute somente em páginas nas quais você confia;
* revise o código antes de utilizá-lo;
* evite executar versões modificadas por terceiros;
* tenha cuidado ao adicionar funcionalidades que façam requisições externas.

Este código, conforme apresentado, não possui uma rotina própria de envio de dados para servidores externos.

---

## 🚀 Como executar

O código pode ser executado no console do navegador em uma página compatível.

### 1. Abra a página desejada

Acesse a aplicação que contém as questões.

### 2. Abra o DevTools

No Chrome/Edge:

```text
F12
```

ou:

```text
Ctrl + Shift + J
```

### 3. Abra a aba Console

Cole o código JavaScript completo.

### 4. Execute

Após a execução, será exibida uma tela inicial:

```text
SISTEMA ATIVO

SCRIPT
INICIADO

N questões carregada(s)
```

Em seguida, o painel principal será exibido.

---

## 🧩 Principais funções

| Função                    | Responsabilidade                     |
| ------------------------- | ------------------------------------ |
| `Clean()`                 | Remove HTML e espaços desnecessários |
| `IsValidQuestions()`      | Valida uma estrutura de questões     |
| `DeepSearch()`            | Procura questões recursivamente      |
| `InitPanel()`             | Inicializa a interface principal     |
| `DetectPageAlternative()` | Localiza a alternativa no DOM        |
| `HighlightDetected()`     | Destaca a alternativa encontrada     |
| `RenderQuestion()`        | Renderiza a questão atual            |
| `ClickCorrectAnswer()`    | Clica na alternativa detectada       |
| `AdvanceQuestion()`       | Avança para a próxima questão        |
| `StartAuto()`             | Inicia o modo automático             |
| `StopAuto()`              | Interrompe o modo automático         |
| `Navigate()`              | Navega entre questões                |

---

## 🎨 Tecnologias utilizadas

O projeto utiliza somente recursos nativos do navegador:

* **JavaScript**
* **HTML**
* **CSS**
* **DOM API**

Não existem dependências externas ou bibliotecas obrigatórias.

---

## 📁 Estrutura sugerida do projeto

Caso queira transformar o código em um projeto organizado:

```text
qap/
├── README.md
├── src/
│   ├── main.js
│   ├── search.js
│   ├── panel.js
│   └── styles.css
└── LICENSE
```

Atualmente, entretanto, todo o código está encapsulado em uma única IIFE:

```javascript
(() => {
    // código
})();
```

Isso reduz o risco de poluir o escopo global da página.

---

## 🔄 Fluxo geral

```text
              ┌───────────────────┐
              │ Executar script   │
              └─────────┬─────────┘
                        ↓
              ┌───────────────────┐
              │ Limpar instância  │
              │ anterior           │
              └─────────┬─────────┘
                        ↓
              ┌───────────────────┐
              │ DeepSearch(window)│
              └─────────┬─────────┘
                        ↓
              ┌───────────────────┐
              │ Encontrou questões│
              └─────────┬─────────┘
                        ↓
              ┌───────────────────┐
              │ Criar painel      │
              └─────────┬─────────┘
                        ↓
              ┌───────────────────┐
              │ Renderizar questão│
              └─────────┬─────────┘
                        ↓
              ┌───────────────────┐
              │ Detectar resposta │
              └─────────┬─────────┘
                        ↓
              ┌───────────────────┐
              │ Destacar no DOM   │
              └─────────┬─────────┘
                        ↓
                 ┌──────┴──────┐
                 │             │
              Manual         Auto
                 │             │
                 ↓             ↓
             Navegação      Clique
                               ↓
                           Próxima
                               ↓
                            Repetir
```

---

## 📝 Status

**Versão:** 1.0
**Tipo:** JavaScript client-side
**Dependências:** Nenhuma
**Interface:** HTML + CSS gerados dinamicamente

---

## 📄 Licença

Adicione aqui a licença escolhida para o projeto, por exemplo:

```text
MIT License
```

Caso o projeto seja publicado publicamente, recomenda-se definir explicitamente os termos de uso e distribuição.

---

## 👤 Contribuição

Sugestões de melhorias:

* suporte a mais estruturas de questões;
* detecção baseada em `MutationObserver`;
* separação do código em módulos;
* configuração do intervalo pelo próprio painel;
* suporte a mais formatos de alternativas;
* persistência das configurações;
* tratamento de páginas que carregam questões dinamicamente;
* testes automatizados para `DeepSearch()` e `DetectPageAlternative()`.

Pull requests e melhorias são bem-vindos.
