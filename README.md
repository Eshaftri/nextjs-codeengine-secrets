# Next.js App Router + IBM Cloud Secrets Manager

This project uses Next.js App Router and securely accesses IBM Cloud Secrets Manager using Trusted Profiles. Ready for IBM Cloud Code Engine.

## Structure

- `app/api/get-secret/route.js` → API route using the App Router
- `app/page.js` → Client-side page to view secrets
- `lib/secretsManager.js` → IBM SDK client

## Setup

1. Create `.env` from `.env.example`
2. Set your trusted profile name, Secrets Manager URL, and secret ID
3. Run `npm run dev` to test locally
4. Deploy to Code Engine

---

## 🔐 Creating a Trusted Profile with `SecretsReader` Access

### 🧠 Why Use Trusted Profiles?

Trusted Profiles allow your Next.js app (running on IBM Cloud Code Engine) to securely access IBM Secrets Manager — without hardcoding API keys or manually rotating credentials.

---

### 🔹 Step 1: Create the Trusted Profile

```bash
ibmcloud iam trusted-profile-create "my-nextjs-profile" \
  --description "Trusted Profile for Next.js app to access Secrets Manager"
```

- Replace `"my-nextjs-profile"` with your desired name.
- Copy the `Profile ID` from the output — you’ll need it in Step 2.

---

### 🔹 Step 2: Grant `SecretsReader` Role to the Profile

```bash
ibmcloud iam trusted-profile-policy-create <PROFILE_ID> \
  --roles SecretsReader \
  --service-name secrets-manager \
  --service-instance <SECRETS_MANAGER_INSTANCE_ID>
```

Replace:
- `<PROFILE_ID>`: From Step 1
- `<SECRETS_MANAGER_INSTANCE_ID>`: Run the following to get it:

```bash
ibmcloud resource service-instances --service-name secrets-manager
```

---

### 🔐 Key Concepts

#### 1. `SecretsReader` Role
- Read-only access to secrets
- Cannot create, modify, or delete
- Follows least privilege principle

#### 2. Trusted Profile vs API Key

| Feature              | API Key              | Trusted Profile                |
|----------------------|----------------------|--------------------------------|
| Credential Storage   | Must store & rotate  | No credentials stored locally  |
| Rotation Required    | Yes                  | No                             |
| Cloud-native Auth    | ❌                   | ✅ Code Engine auto-auth        |

#### 3. Where Will You Use This?
You’ll bind this Trusted Profile to your Code Engine app for secure access to Secrets Manager.


---

### 📦 SDK Installation for Next.js

```bash
npm install ibm-cloud-sdk-core @ibm-cloud/secrets-manager
```

---

## 📁 .env Setup

Before running or deploying the application, configure your environment variables.

1. **Rename** the `.env.example` file to `.env`
2. **Replace** placeholders with actual values

### ✅ Example .env file:

```bash
# Required for production deployment on Code Engine
SM_TRUSTED_PROFILE_ID=sm-trusted-profile-id
SM_SERVICE_URL=https://<GUID>.private.<REGION>.secrets-manager.appdomain.cloud
SM_TRUSTED_PROFILE_ID=sm-secret-id

# Required only for local development (using API Key)
CLOUD_API_KEY=cloud-api-key
SM_SERVICE_URL=https://<GUID>.<REGION>.secrets-manager.appdomain.cloud
SM_TRUSTED_PROFILE_ID=sm-secret-id
```

🔐 **Notes:**
- Use `SM_TRUSTED_PROFILE_ID` for apps running inside IBM Cloud Code Engine.
- Use `CLOUD_API_KEY` for local testing with public endpoint access.
- Do **not** commit `.env` files to Git — they contain sensitive data.
