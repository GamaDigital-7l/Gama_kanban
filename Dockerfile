FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache     curl     postgresql-client     python3     make     g++

# Criar usuário não-root
RUN addgroup -g 1001 -S gama &&     adduser -S gama -u 1001

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY . .

# Definir permissões
RUN chown -R gama:gama /app
USER gama

# Criar diretórios necessários
RUN mkdir -p uploads public/uploads public/avatars public/backgrounds

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3   CMD curl -f http://localhost:3000/api/health || exit 1

# Comando de inicialização
CMD ["node", "server.js"]
