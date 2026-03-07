# 十七音 - 部署指南

## 项目结构

```
seventeen-sounds-api/
├── api/
│   ├── haiku/       # 俳句 API
│   ├── user/        # 用户 API
│   └── points/      # 点数 API
├── admin/           # 管理后台
├── package.json
└── vercel.json
```

## 1. 部署到 Vercel

### 前置要求
- Vercel 账号 (vercel.com)
- Vercel KV (Redis) 免费版

### 部署步骤

```bash
# 安装 Vercel CLI
npm i -g vercel

# 进入项目目录
cd seventeen-sounds-api

# 登录
vercel login

# 部署
vercel

# 按提示选择:
# - Set up and deploy? Yes
# - Which scope? 你的用户名
# - Link to existing project? No
# - Project name? seventeen-sounds-api
# - Directory? ./
# - Want to modify settings? No
```

### 配置 Vercel KV

1. 在 Vercel Dashboard 创建 KV Store:
   - Dashboard > Storage > Create Database > KV
   - 选择免费版

2. 添加环境变量:
   - KV_REST_API_URL
   - KV_REST_API_TOKEN

## 2. 部署管理后台

管理后台已经在 `admin/index.html`，可以通过以下方式托管：

### 方式 A: Vercel 托管
```bash
# 部署时会把 admin 一起部署
vercel
```

### 方式 B: 独立托管
```bash
npx serve admin
```

## 3. API 接口文档

### 用户 API

**创建用户**
```
POST /api/user
Body: { "name": "用户名", "email": "email" }
```

**获取用户**
```
GET /api/user?userId=user_123
```

### 俳句 API

**创建俳句**
```
POST /api/haiku
Body: { 
  "userId": "user_123",
  "lines": ["古池や", "蛙飛び込む", "水の音"],
  "season": "春",
  "author": "芭蕉"
}
```

**获取俳句列表**
```
GET /api/haiku?limit=20
GET /api/haiku?userId=user_123
```

### 点数 API

**获取点数**
```
GET /api/points?userId=user_123
```

**消耗/增加点数**
```
POST /api/points
Body: { 
  "userId": "user_123", 
  "amount": 10, 
  "type": "consume" // 或 "add"
}
```

## 4. 管理后台地址

部署完成后访问:
```
https://your-project.vercel.app/admin
```

## 5. 本地开发

```bash
# 安装依赖
npm install

# 启动本地开发服务器
vercel dev
```

本地 API 地址: http://localhost:3000
管理后台: http://localhost:3000/admin
