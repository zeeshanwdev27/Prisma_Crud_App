# Project Setup

## 📦 Packages Installed

### Production Dependencies

```bash
npm install express bcryptjs jsonwebtoken cookie-parser zod
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

### Development Dependencies

```bash
npm install -D typescript tsx @types/node @types/express @types/jsonwebtoken @types/cookie-parser
npm install -D prisma @types/pg
```

## ⚙️ TypeScript Setup

```bash
npx tsc --init
```

## 🗄️ Prisma Setup

Check Prisma CLI:

```bash
npx prisma
```

Initialize Prisma with PostgreSQL:

```bash
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

---

# 🚀 Run the Project

### 1. Generate Prisma Client

```bash
npx prisma generate
```

### 2. Apply Existing Migrations

```bash
npx prisma migrate deploy
```

### 3. Start Development Server

```bash
npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=
JWT_SECRET=
```

---

# 🔄 Updating the Prisma Schema

Whenever you make changes to `schema.prisma`, create a new migration:

```bash
npx prisma migrate dev --name any_name
```

Then regenerate Prisma Client if needed:

```bash
npx prisma generate
```
