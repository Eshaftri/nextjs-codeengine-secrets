// import SecretsManager from "@ibm-cloud/secrets-manager/secrets-manager/v2.js";
// import { ContainerAuthenticator } from "ibm-cloud-sdk-core";

// const secretsManager = new SecretsManager({
//   authenticator: new ContainerAuthenticator({
//     iamProfileName: process.env.SM_TRUSTED_PROFILE_ID,
//   }),
//   serviceUrl: process.env.SM_SERVICE_URL,
// });

// export default secretsManager;


import SecretsManager from "@ibm-cloud/secrets-manager/secrets-manager/v2.js";
import {
  ContainerAuthenticator,
  IamAuthenticator,
} from "ibm-cloud-sdk-core";

const isLocal = process.env.NODE_ENV === "development";

const authenticator = isLocal
  ? new IamAuthenticator({ apikey: process.env.CLOUD_API_KEY })
  : new ContainerAuthenticator({ iamProfileName: process.env.SM_TRUSTED_PROFILE_ID });

const secretsManager = new SecretsManager({
  authenticator,
  serviceUrl: process.env.SM_SERVICE_URL,
});

export default secretsManager;