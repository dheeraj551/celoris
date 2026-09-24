-- Motion Swap Studio (Higgsfield Genjutsu video jobs) shares the ai_generations table.
-- APPLIED on 2026-09-24.
alter table public.ai_generations drop constraint if exists ai_generations_app_check;
alter table public.ai_generations add constraint ai_generations_app_check
  check (app = any (array['vio'::text, 'photolite'::text, 'motion-swap'::text]));
