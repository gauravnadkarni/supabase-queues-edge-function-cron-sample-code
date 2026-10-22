import { getEnvValue } from "utils";

export const checkAuthForEdgeFunction = (apiKey: string) => {
  const customApiKey = getEnvValue("X-EDGE-FUNCTION-API-KEY");
  return customApiKey === apiKey ? true : false;
};
