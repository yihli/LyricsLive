# build frontend static files
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend

COPY --from=frontend-build /app/frontend/dist ./backend/dist

WORKDIR /app/backend

EXPOSE 3000
CMD ["npm", "start"]