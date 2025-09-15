# 🚀 Node.js Backend with PostgreSQL Deployment Guide

This guide provides step-by-step instructions to deploy a **Node.js backend** with **PostgreSQL 16** on an **Ubuntu EC2 instance**, including **PM2 process management**, **Nginx reverse proxy**, **SSL setup**, and **database roles**.

---

## 📦 1. Update & Upgrade System Packages

Update system packages to ensure the latest security patches and updates:

```bash
sudo apt update
sudo apt upgrade -y
