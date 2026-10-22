import { createClient } from "supabaseLib";
import { getEnvValue } from "utils";

export function getServiceClient() {
  const supbaseUrl = getEnvValue("SUPABASE_URL");
  const serviceRoleSecret = getEnvValue("SERVICE_SECRET");

  return createClient(supbaseUrl, serviceRoleSecret);
}

export const supabase = getServiceClient();
