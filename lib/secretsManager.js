import SecretsManager from "@ibm-cloud/secrets-manager/secrets-manager/v2.js";
import {
  IamAuthenticator,
  ContainerAuthenticator,
} from "ibm-cloud-sdk-core";

function createAuthenticator() {
  const isLocal = process.env.NODE_ENV === "development";

  if (isLocal) {
    if (!process.env.CLOUD_API_KEY) {
      throw new Error("Missing CLOUD_API_KEY for local Secrets Manager access.");
    }
    return new IamAuthenticator({
      apikey: process.env.CLOUD_API_KEY,
    });
  }

  if (!process.env.SM_TRUSTED_PROFILE_ID) {
    throw new Error("Missing SM_TRUSTED_PROFILE_ID for Code Engine workload identity.");
  }

  return new ContainerAuthenticator({
    iamProfileName: process.env.SM_TRUSTED_PROFILE_ID,
  });
}

// Validate Secrets Manager URL
if (!process.env.SM_SERVICE_URL) {
  throw new Error("Missing SM_SERVICE_URL environment variable.");
}

// Create and export the singleton SecretsManager client
export const secretsManager = new SecretsManager({
  authenticator: createAuthenticator(),
  serviceUrl: process.env.SM_SERVICE_URL,
});
