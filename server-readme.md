# Node.js Backend with PostgreSQL Deployment Guide

## 1. Update & Upgrade System Packages
```bash
sudo apt update
sudo apt upgrade -y

2. Install Node.js & NPM

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Check versions
node -v
npm -v
