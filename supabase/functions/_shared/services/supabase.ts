import { getEnvValue } from "utils";
import { createClient } from "supabaseLib";

const supabaseUrl = getEnvValue("SUPABASE_URL")!;
const supabaseKey = getEnvValue("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseQueue = createClient(supabaseUrl, supabaseKey, {
  db: { schema: "pgmq_public" },
});

const supabaseDb = createClient(supabaseUrl, supabaseKey, {
  db: { schema: "public" },
});

export const readMessageFromQueue = async (
  queueName: string,
  messageCount: number,
  visibilityTimeoutInSeconds: number = 15,
) =>
  supabaseQueue.rpc("read", {
    queue_name: queueName,
    sleep_seconds: visibilityTimeoutInSeconds,
    n: messageCount,
  });

export const deleteMessageFromQueue = async (
  queueName: string,
  messageId: string,
) =>
  supabaseQueue.rpc("delete", {
    queue_name: queueName,
    message_id: messageId,
  });

export const getUserTableData = (userId: string) =>
  supabaseDb.from("user").select("*").eq("id", userId).maybeSingle();
