# Configuração do Gama para TrueNAS Scale

## Pré-requisitos:
1. TrueNAS Scale 22.12 ou superior
2. Docker habilitado
3. Portainer (recomendado para gerenciamento)

## Instalação via Portainer:

### Método 1: Stack no Portainer
1. Acesse o Portainer em seu TrueNAS
2. Vá em "Stacks" > "Add Stack"
3. Cole o conteúdo do docker-compose.yml
4. Ajuste as variáveis conforme necessário
5. Deploy o stack

### Método 2: Via SSH (Terminal)
```bash
# 1. Criar diretório do projeto
mkdir -p /mnt/pool/apps/gama
cd /mnt/pool/apps/gama

# 2. Baixar os arquivos
# Copie todos os arquivos para este diretório

# 3. Executar o container
docker-compose up -d
```

## Configurações importantes:

### Volumes persistentes:
- /mnt/pool/apps/gama/data/db:/var/lib/postgresql/data
- /mnt/pool/apps/gama/data/uploads:/app/uploads  
- /mnt/pool/apps/gama/data/public:/app/public

### Variáveis de ambiente para alterar:
- SECRET_KEY: Gere uma chave secreta forte
- BASE_URL: Seu domínio ou IP do TrueNAS
- ADMIN_EMAIL: Email do administrador
- ADMIN_PASSWORD: Senha forte para o admin

### Portas:
- Web UI: 3000 (acesse via http://seu-truenas-ip:3000)
- PostgreSQL: 5432 (apenas interno)
- Redis: 6379 (apenas interno)

## Backup e Restauração:
```bash
# Backup do banco
docker exec gama-db pg_dump -U postgres gama > backup_gama.sql

# Restauração
docker exec -i gama-db psql -U postgres gama < backup_gama.sql
```

## Monitoramento:
- Health checks inclusos
- Logs: docker-compose logs -f gama-app
- Status: docker-compose ps

## Atualizações:
```bash
cd /mnt/pool/apps/gama
docker-compose pull
docker-compose up -d
```
