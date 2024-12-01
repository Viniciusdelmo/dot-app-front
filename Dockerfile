# Use a imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos essenciais
COPY package.json package-lock.json* ./ 

# Instala as dependências
RUN npm install

# Copia o restante do código para o container
COPY . .

# Gera o build da aplicação Next.js
RUN npm run build

# Build da aplicação (opcional, se você quer executar em modo produção)
RUN npm run build

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
