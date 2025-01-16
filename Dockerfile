# Use a imagem oficial do Node.js
FROM node:16

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta usada pelo backend
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
