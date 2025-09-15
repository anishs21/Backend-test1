 🚀 Node.js Backend with PostgreSQL Deployment Guide  

This guide covers the setup of a **Node.js backend with PostgreSQL 16** on an **Ubuntu EC2 instance**, with **PM2 process manager**, **Nginx reverse proxy**, and optional **SSL configuration**.

---

## 📦 1. Update & Upgrade System Packages  

```bash
sudo apt update
sudo apt upgrade -y
🔧 2. Install Node.js & NPM
Use NodeSource to install the latest LTS version (Node.js 20.x in this case).

bash
Copy code
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
Verify installation:

bash
Copy code
node -v   # Must be ≥ 20.6
npm -v
⚙️ 3. Install PM2 (Process Manager for Node.js)
bash
Copy code
sudo npm install -g pm2
pm2 -v
🗄️ 4. Install PostgreSQL 16.4
Add PostgreSQL Repository
bash
Copy code
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
Install PostgreSQL 16
bash
Copy code
sudo apt install -y postgresql-16 postgresql-contrib-16
psql --version
🌐 5. Install & Configure Nginx
bash
Copy code
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
🛠️ 6. Configure PostgreSQL Database & User
Login as postgres user:

bash
Copy code
sudo -u postgres psql
Create Database & Assign Password
sql
Copy code
CREATE DATABASE localdb;
ALTER USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE localdb TO postgres;
Exit:

sql
Copy code
\q
📂 7. Project Setup
bash
Copy code
mkdir travelhero
cd travelhero
Clone Repository
bash
Copy code
git init
git remote add origin https://github.com/Rajsekar-s-Organisation/travelhero.git
git checkout -b main
git pull origin main
Configure Git Credentials
bash
Copy code
git config credential.helper store
git config user.name "Your Name"
git config user.email "your@email.com"
Verify credentials:

bash
Copy code
cat ~/.git-credentials
📦 8. Install Dependencies
bash
Copy code
npm install
Run locally for testing:

bash
Copy code
npm start
🚀 9. Run with PM2 (Production Mode)
bash
Copy code
pm2 start npm --name travelhero-backend -- start
pm2 startup
pm2 save
pm2 logs travelhero-backend
🌍 10. Configure Nginx Reverse Proxy
Remove default config:

bash
Copy code
sudo rm /etc/nginx/sites-enabled/default
Create new config:

bash
Copy code
sudo nano /etc/nginx/sites-available/travelhero
Add the following:

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
Enable configuration:

bash
Copy code
sudo ln -s /etc/nginx/sites-available/travelhero /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
🔐 11. Enable SSL with Certbot (Optional)
bash
Copy code
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d 82n.xyz -d www.82n.xyz
Auto-renewal test:

bash
Copy code
sudo certbot renew --dry-run
🛡️ 12. Database Role Management
Admin Role (Full Access)
sql
Copy code
CREATE ROLE travelhero_admin WITH LOGIN PASSWORD 'StrongAdminPass';
GRANT ALL PRIVILEGES ON DATABASE localdb TO travelhero_admin;
Application Role (CRUD Access)
sql
Copy code
CREATE ROLE travelhero_app WITH LOGIN PASSWORD 'StrongAppPass';
GRANT CONNECT ON DATABASE localdb TO travelhero_app;

\c localdb

GRANT USAGE ON SCHEMA public TO travelhero_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO travelhero_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO travelhero_app;
Read-Only Role (Optional)
sql
Copy code
CREATE ROLE travelhero_readonly WITH LOGIN PASSWORD 'ReadOnlyPass';

\c localdb

GRANT CONNECT ON DATABASE localdb TO travelhero_readonly;
GRANT USAGE ON SCHEMA public TO travelhero_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO travelhero_readonly;
📝 13. Environment Configuration (.env)
Create .env in project root:

ini
Copy code
# Server
PORT=3000
NODE_ENV=development
HTTPS=false

# Encryption
SC_ENCRYPTION_KEY=thisisthesecretkeytomyencryption

# PostgreSQL Connection
SQL_DB=postgres
POSTGRESQL_USER=postgres
POSTGRESQL_HOST=127.0.0.1
POSTGRESQL_DBNAME=localdb
POSTGRESQL_PASSWORD=postgres
POSTGRESQL_PORT=5432

# Optional full URL (if ORM supports)
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/localdb
✅ 14. Verification Checklist
 Node.js ≥ 20.6 installed

 PostgreSQL 16.4 installed & secured

 Nginx reverse proxy configured

 PM2 running backend (pm2 status)

 SSL configured (if using HTTPS)

 Application environment variables set

yaml
Copy code

---

Do you also want me to include a **Markdown system architecture diagram (Mermaid)** so it looks extra professional in GitHub Docs?







Ask ChatGPT
