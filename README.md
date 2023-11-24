# Aplicação de Chat "GameChat" com Socket.io

Esta é uma aplicação de chat simples, denominada "GameChat", construída usando Node.js, Express e Socket.io. Os usuários podem se conectar ao servidor, escolher um nome de usuário, ingressar em salas de bate-papo e trocar mensagens em tempo real. A aplicação mantém o controle do número de usuários, exibe mensagens anteriores e suporta mensagens privadas entre os participantes. Além disso, agora também oferece suporte à criação de novas salas de bate-papo.

## Como Começar

1. **Instalar Dependências**
   ```
   npm install
   ```

2. **Iniciar o Servidor**
   ```
   node socketChat.js
   ```

3. **Acessar a Aplicação**
   Abra o seu navegador e vá para [http://localhost:3000](http://localhost:3000)

## Recursos

- **Comunicação em Tempo Real:** Utiliza o Socket.io para comunicação em tempo real entre o servidor e os clientes.

- **Autenticação de Usuários:** Os usuários podem se conectar ao servidor, escolher um nome de usuário e ingressar em salas de bate-papo.

- **Salas de Bate-Papo:** Suporta a criação de diferentes salas de bate-papo onde os usuários podem ingressar e interagir.

- **Criação de Novas Salas:** Os usuários podem criar novas salas de bate-papo, fornecendo um nome para a sala.

- **Contagem de Usuários:** Exibe o número atual de usuários online em tempo real.

- **Mensagens Anteriores:** Mostra mensagens anteriores quando os usuários ingressam em uma sala de bate-papo.

- **Mensagens Privadas:** Os usuários podem enviar mensagens privadas entre si.

## Uso

1. **Página Inicial:**
   - Acesse a página inicial em [http://localhost:3000](http://localhost:3000).
   - Insira um nome de usuário e clique em "Conectar" para ingressar no chat.

2. **Salas de Bate-Papo:**
   - Crie uma nova sala de bate-papo inserindo um nome no campo fornecido e clicando em "Criar Sala".
   - Ingresse em salas de bate-papo existentes clicando em seus nomes.

3. **Mensagens:**
   - Envie mensagens na sala de bate-papo digitando no campo de entrada e pressionando "Enter" ou clicando em "Enviar".
   - Mensagens privadas podem ser enviadas selecionando um usuário e usando a funcionalidade de mensagem privada.

4. **Desconectar:**
   - Desconecte-se do chat fechando a janela ou aba do navegador.
   - A contagem de usuários é atualizada em tempo real quando os usuários ingressam ou se desconectam.

## Tecnologias Utilizadas

- Node.js
- Express
- Socket.io

## Agradecimentos

Agradecimentos especiais aos desenvolvedores do Node.js, Express e Socket.io por fornecerem excelentes ferramentas para a construção de aplicações em tempo real.
