-- Habilita Row Level Security (RLS) en todas las tablas del esquema public.
--
-- Por qué: Supabase expone una API REST (PostgREST) sobre el esquema `public`
-- usando la anon key. Sin RLS, cualquiera con la anon key podría leer/escribir
-- estas tablas directo, saltándose la API de NestJS. El Security Advisor lo
-- marca como error ("RLS Disabled in Public").
--
-- Seguro para la API: la app se conecta con el rol `postgres` (dueño de las
-- tablas), que IGNORA RLS. Al habilitar RLS sin políticas, los roles anon /
-- authenticated (PostgREST) quedan denegados por completo, mientras que las
-- queries de Prisma siguen funcionando igual.
--
-- Correr en: Supabase → SQL Editor → New query → Run.
-- Es idempotente: re-correrlo no causa problemas.

ALTER TABLE public."TalentLead"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ContactRequest"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Admin"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PasswordResetToken"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CvFile"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CandidateApplication"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Company"               ENABLE ROW LEVEL SECURITY;

-- Verificación (opcional): debe mostrar rowsecurity = true en las 7 tablas.
-- SELECT relname, relrowsecurity
-- FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
-- WHERE n.nspname = 'public' AND relkind = 'r'
-- ORDER BY relname;
