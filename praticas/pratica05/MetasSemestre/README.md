# MetasSemestre

Aplicativo React Native/Expo para cadastrar metas acadêmicas, concluí-las e removê-las. As informações ficam salvas no aparelho e continuam disponíveis ao reabrir o aplicativo.

## Como executar

```bash
npx expo install @react-native-async-storage/async-storage react-native-safe-area-context
npx expo start
```

> Após criar o projeto com o Expo, use `npx expo install` para instalar as dependências compatíveis com a versão do SDK. Não use `npm install` puro para esses pacotes.

## Organização

```
pratica05/
├── App.js
├── components/
│   ├── MetaInput.js
│   └── MetaList.js
└── assets/
    └── academic-header.png
```

- `MetaInput` recebe `value`, `onChangeText` e `onAdd`; contém o campo de texto e o botão de adicionar.
- `MetaList` recebe `metas`, `onDelete` e `onToggle`; renderiza uma `FlatList` e cada item tem ações em `Pressable`.
- Cada meta tem `id`, `texto`, `criadaEm` e `concluida`. A remoção usa `filter`, sem mutar o array.

## Persistência com useEffect

Em `App.js`, o primeiro `useEffect` chama `AsyncStorage.getItem('@metas_semestre')` apenas na montagem. O valor é convertido com `JSON.parse` e alimenta o estado da lista.

O segundo `useEffect` observa `metas`; depois que a carga inicial termina, salva qualquer alteração com `AsyncStorage.setItem('@metas_semestre', JSON.stringify(metas))`. Os dois fluxos usam `try/catch` e exibem mensagens amigáveis se houver falha.

## Funcionalidades extras

- Toque no item para marcar a meta como concluída ou pendente.
- Metas concluídas ficam riscadas.
- O cabeçalho mostra o total de pendentes e concluídas.
- Os botões possuem feedback de toque e `android_ripple` no Android.

## Prints para a entrega

Antes de abrir o Pull Request, salve três capturas nesta pasta e inclua-as abaixo:

| Situação | Arquivo sugerido |
| --- | --- |
| Lista vazia | `docs/prints/01-lista-vazia.png` |
| Metas cadastradas | `docs/prints/02-com-itens.png` |
| App reaberto com as metas preservadas | `docs/prints/03-apos-reabrir.png` |

Depois de adicionar as imagens, troque esta tabela por:

```md
![Lista vazia](docs/prints/01-lista-vazia.png)
![Metas cadastradas](docs/prints/02-com-itens.png)
![Metas preservadas após reabrir](docs/prints/03-apos-reabrir.png)
```
