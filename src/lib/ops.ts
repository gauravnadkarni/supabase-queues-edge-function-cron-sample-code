import {
  createClientWithAnonKey,
  createClientWithServiceKeyForPublicSchema,
  createClientWithServiceKeyForQueue,
} from "./auth.ts";

export async function registerUser(
  email: string,
  password: string,
  name: string,
) {
  const supabaseAnon = createClientWithAnonKey();
  const { data, error } = await supabaseAnon.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullname: name,
      },
    },
  });
  if (error) {
    throw new Error(error.message);
  }
  return data.user!;
}

export async function saveUserToDb(id: string, email: string, name: string) {
  const supabaseService = createClientWithServiceKeyForPublicSchema();
  const { data, error } = await supabaseService
    .from("user")
    .insert({ id, name, email })
    .select();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function publishMessageToQueue(
  queueName: string,
  data: Record<string, any>,
  delayMessageVisibilityInSec: number,
) {
  const supabaseService = createClientWithServiceKeyForQueue();
  const { data: res, error } = await supabaseService
    .schema("pgmq_public")
    .rpc("send", {
      queue_name: queueName,
      message: data,
      sleep_seconds: delayMessageVisibilityInSec,
    });
  if (error) {
    throw new Error(error.message);
  }
  return res;
}

export async function createNewUser(
  email: string,
  password: string,
  name: string,
) {
  const authUser = await registerUser(email, password, name);
  const dbUser = await saveUserToDb(
    authUser.id,
    authUser.email || email,
    authUser.user_metadata.fullname || name,
  );
  await publishMessageToQueue(
    "send-email-queue",
    { userId: authUser.id, type: "WELCOME_EMAIL" },
    0,
  );
  return { authUser, dbUser };
}
