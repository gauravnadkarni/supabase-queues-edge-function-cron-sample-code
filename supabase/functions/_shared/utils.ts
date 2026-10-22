function getEnvValue(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

function logAsInfo(data: any, sessionIdentifier: string): void {
  console.log(
    JSON.stringify({
      internalRequestId: sessionIdentifier,
      ...data,
    }),
  );
}

function logAsError(data: any, sessionIdentifier: string): void {
  console.error(
    JSON.stringify({
      internalRequestId: sessionIdentifier,
      ...data,
    }),
  );
}

function checkAuth(apiKey: string) {
  const serviceSecret = getEnvValue("SERVICE_SECRET");
  if (apiKey !== serviceSecret) {
    throw new Error("Invalid secret passed");
  }
}

export { getEnvValue, logAsInfo, logAsError, checkAuth };
