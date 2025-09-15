# Node.js Backend with PostgreSQL Deployment Guide

## 1. Update & Upgrade System Packages and Install Node.js & NPM
```bash
# Update & upgrade system packages
sudo apt update
sudo apt upgrade -y

**# Install Node.js (LTS ≥ 20.6) using NodeSource**
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

**# Verify installation**
node -v
npm -v
