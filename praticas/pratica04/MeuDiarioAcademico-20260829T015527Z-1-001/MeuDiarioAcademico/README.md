# MeuDiarioAcademico

Aplicativo desenvolvido para a Atividade 01 da disciplina de Programação para
Dispositivos Móveis. A tela permite cadastrar rapidamente as disciplinas do
semestre e apresenta os itens em uma lista organizada.

## Print da tela

![Tela inicial do MeuDiarioAcademico](./docs/meu-diario-academico.png)

## Comando de criação

```bash
npx create-expo-app@latest MeuDiarioAcademico --template blank
```

A biblioteca de área segura foi adicionada com o comando recomendado pelo
Expo:

```bash
npx expo install react-native-safe-area-context
```

## Como executar

Pré-requisito: Node.js LTS 22.11 ou superior.

```bash
cd MeuDiarioAcademico
npm install
npx expo start
```

Depois, abra o projeto em um emulador Android ou leia o QR Code com o Expo Go.

## Recursos implementados

- rótulos centralizados e exportados pelo arquivo `labels.js`;
- `SafeAreaView` de `react-native-safe-area-context`;
- formulário em linha usando Flexbox e larguras percentuais;
- cadastro funcional de disciplinas com validação de campo vazio;
- lista de disciplinas com contador;
- estilos organizados com `StyleSheet.create`;
- botão criado com `Pressable` e efeito visual ao pressionar;
- `Switch` demonstrativo para exibir apenas disciplinas obrigatórias.

O diretório `node_modules` está listado no `.gitignore` e não deve ser incluído
no repositório nem no pull request.
