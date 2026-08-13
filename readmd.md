# Pkgs I Install For this Project

1. npm i express bcryptjs jsonwebtoken cookie-parser zod 
2. npm install -D typescript tsx @types/node @types/express @types/jsonwebtoken @types/cookie-parser
3. npx tsc --init
4. npm install prisma @types/pg --save-dev
5. npm install @prisma/client @prisma/adapter-pg pg dotenv

6. npx prisma
7. npx prisma init --datasource-provider postgresql --output ../generated/prisma


# Run Project
8. npx prisma generate
9. npx prisma migrate deploy 
10. npm run dev


# Envs
1. DATABASE_URL=
2. JWT_SECRET=