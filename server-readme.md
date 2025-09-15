# Node.js Backend with PostgreSQL Deployment Guide

## 1. Update & Upgrade System Packages
Always start by updating system packages:

```bash
sudo apt update
sudo apt upgrade -y
2. Install Node.js & NPM
Use NodeSource to install the latest LTS version (≥ 20.6):

bash
Copy code
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Check versions
node -v
npm -v
3. Install PM2 (Process Manager for Node.js)
bash
Copy code
sudo npm install -g pm2
pm2 -v
4. Install PostgreSQL 16.4
bash
Copy code
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-16 postgresql-contrib-16
psql --version
5. Install Nginx
bash
Copy code
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
6. Configure PostgreSQL Database & User
sql
Copy code
-- Log in as postgres
sudo -i -u postgres psql

CREATE DATABASE localdb;
ALTER USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE localdb TO postgres;

\q
exit
7. Project Setup
bash
Copy code
mkdir travelhero
cd travelhero

git init
git remote add origin https://github.com/Rajsekar-s-Organisation/travelhero.git
git checkout -b main
git pull origin main

# Store credentials
git config credential.helper store

# Verify credential helper
git config credential.helper
git config --global credential.helper

# Check stored credentials
cat ~/.git-credentials

# Check Git username & email
git config user.name
git config user.email

# Set username & email (if not set)
git config user.name "Your Name"
git config user.email "your@email.com"

# Install dependencies
npm install

# Run locally
npm start
8. Run with PM2 (Production)
bash
Copy code
pm2 start npm --name travelhero-backend -- start
pm2 startup
pm2 save
pm2 logs travelhero-backend
9. Nginx Setup
bash
Copy code
sudo rm /etc/nginx/sites-enabled/default
sudo nano /etc/nginx/sites-available/travelhero
Nginx config (/etc/nginx/sites-available/travelhero):

nginx
Copy code
server {
    listen 80;
    server_name 82n.xyz;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
bash
Copy code
sudo ln -s /etc/nginx/sites-available/travelhero /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
Add domain and IP in Route53

Or use Certbot for SSL:

bash
Copy code
sudo certbot --nginx -d 82n.xyz -d www.82n.xyz
10. DB Setup for Separate Database Roles
10.1 Admin Role (Full Privileges)
sql
Copy code
CREATE ROLE travelhero_admin WITH LOGIN PASSWORD 'StrongAdminPass';
GRANT ALL PRIVILEGES ON DATABASE localdb TO travelhero_admin;
10.2 Application Role (Read/Write Only)
sql
Copy code
CREATE ROLE travelhero_app WITH LOGIN PASSWORD 'StrongAppPass';
GRANT CONNECT ON DATABASE localdb TO travelhero_app;
\c localdb
GRANT USAGE ON SCHEMA public TO travelhero_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO travelhero_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO travelhero_app;
10.3 Read-Only Role (Optional)
sql
Copy code
CREATE ROLE travelhero_readonly WITH LOGIN PASSWORD 'ReadOnlyPass';
\c localdb
GRANT CONNECT ON DATABASE localdb TO travelhero_readonly;
GRANT USAGE ON SCHEMA public TO travelhero_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO travelhero_readonly;
11. Create Tables (if manually needed)
sql
Copy code
-- Example
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);
12. .env Setup
env
Copy code
# Port number
PORT=3000

# Environment 
NODE_ENV=development

# Encryption secret
SC_ENCRYPTION_KEY=thisisthesecretkeytomyencryption

# HTTP config
HTTPS=false

# PostgreSQL - EC2 Database
SQL_DB=postgres
POSTGRESQL_USER=postgres
POSTGRESQL_HOST=127.0.0.1
POSTGRESQL_DBNAME=localdb
POSTGRESQL_PASSWORD=postgres
POSTGRESQL_PORT=5432

# Optional full URL format (if your ORM supports it)
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/localdb
