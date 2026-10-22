import { createClient } from "@supabase/supabase-js";

export function createClientWithAnonKey() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );
}

export function createClientWithServiceKeyForPublicSchema() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema: "public" },
    },
  );
}

export function createClientWithServiceKeyForQueue() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema: "pgmq_public" },
    },
  );
}
