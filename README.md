# LATAM Tech Talent Network

Landing page + backend para una red curada de talento tecnológico LATAM.
Sigue la misma arquitectura que Nupza (`nupza-web` / `nupza-api`).

## Estructura

```
latamtechtn/
  web/   Angular standalone (landing, mobile-first, copy service + JSON)
  api/   NestJS + GraphQL Apollo + Prisma (DTO + Repository + Service + Facade + Resolver + Module)
```

## Web (`web/`)

Angular standalone, mismo patrón que `nupza-web`:

- Textos centralizados en `LatamCopyService` + `models/copy/landing.model.ts` + `assets/language-resources/latam-es.json` / `latam-en.json`. No hay textos hardcodeados en templates.
- Tokens de diseño (variables CSS) en `src/styles.scss`, reutilizados por todos los componentes.
- Componentes standalone con `ChangeDetectionStrategy.OnPush` y `AsyncPipe`.
- Formularios reactivos que envían mutaciones GraphQL vía Apollo (`TalentService`).

```bash
cd web
yarn install
yarn start          # compila (producción) y abre el navegador en http://localhost:4200
yarn start:dev      # modo desarrollo con recarga rápida + abre el navegador
yarn build          # build de producción a dist/
```

La URL del backend se configura en `web/src/environments/environment.ts`
(`apiUrl`, por defecto `http://localhost:3000/graphql`).

### Seguridad de datos de candidatos

Las tarjetas de "Talento Destacado" usan **datos de ejemplo** (`Candidato #01`…`#10`)
definidos en el JSON de copy. No hay nombres reales, fotos reales ni enlaces a
LinkedIn de candidatos. Los avatares son SVG genéricos (`web/src/assets/avatars/`)
con **blur por CSS**. El botón "🔒 Ver Perfil" abre el formulario de solicitud de
talento; nunca enlaza a un perfil real.

## API (`api/`)

NestJS + GraphQL (code-first, Apollo) + Prisma, mismo patrón de módulos que `nupza-api`.

Entidades (`prisma/schema.prisma`):

- `TalentLead` — solicitudes de empresas (formulario "Solicitar Talento").
- `CandidateApplication` — aplicaciones de candidatos (formulario "Unirse a la Red").
- `ContactRequest` — contacto genérico.

Cada dominio sigue: `*.dto.ts` → `*.repository.ts` → `*.service.ts` → `*.facade.ts` → `*.resolver.ts` → `*.module.ts`.
Las mutaciones de creación son públicas (no requieren auth); validación básica con `class-validator`.

```bash
cd api
npm install
cp .env.example .env          # configurar DATABASE_URL (PostgreSQL)
npm run generate              # prisma generate
npm run db:push               # crear tablas (requiere Postgres)
npm run start:dev             # http://localhost:3000/graphql
```

Mutaciones expuestas: `createTalentLead`, `createCandidateApplication`, `createContactRequest`.

## Datos de contacto y assets

Enlaces y datos reales centralizados en `web/src/app/shared/constants/contact.constants.ts`
(sin hardcodear en templates):

| Qué | Valor |
| --- | --- |
| Email | `elbacaseres83@gmail.com` |
| LinkedIn | `https://www.linkedin.com/in/elba-maria-caseres-887b62217/` |
| Calendly | `https://calendly.com/elbacaseres83/30min` |
| WhatsApp / celular | `+54 3446 590156` (`https://wa.me/543446590156`) |

### Pendiente: foto real de Elba

La foto se referencia en `AssetUrl.ELBA_PHOTO` → `/assets/images/elba-profile.jpg`.
Guardá la foto real en **`web/src/assets/images/elba-profile.jpg`** y se mostrará
automáticamente. Hasta que el archivo exista, el `<img>` cae a un placeholder SVG
(`elba-profile.svg`) vía `(error)`, así que nunca se ve una imagen rota.
