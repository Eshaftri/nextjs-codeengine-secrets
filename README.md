# 🔐 Next.js App Router + IBM Cloud Secrets Manager

This project demonstrates how to securely access **IBM Cloud Secrets Manager** in a **Next.js App Router** application — using **Trusted Profiles** for production and **API keys** for local development. The app is designed for seamless deployment to **IBM Cloud Code Engine**.

---

## 🧱 Project Structure

| Path                          | Purpose                                      |
|-------------------------------|----------------------------------------------|
| `app/api/get-secret/route.js` | API route to fetch secret using the SDK      |
| `app/page.js`                 | Client UI to invoke secret reading           |
| `lib/secretsManager.js`       | IBM SDK client wrapper with dynamic auth     |

---

## ⚙️ Setup & Run

### 1. Clone and Configure
```bash
cp .env.example .env
# Edit `.env` to match your setup
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Locally
```bash
npm run dev
```

> ✅ Uses `CLOUD_API_KEY` and the public Secrets Manager URL for local dev.

---

## 🚀 Deploy to IBM Cloud Code Engine

When running in Code Engine, the app authenticates using a **Trusted Profile** (no API key needed).

---

## 🔐 Set Up Trusted Profile for Secrets Manager

### Step 1: Create Trusted Profile
```bash
ibmcloud iam trusted-profile-create "my-nextjs-profile" \
  --description "Trusted Profile for Next.js app to access Secrets Manager"
```

📌 **Note**: Save the Profile ID from the output.

---

### Step 2: Assign SecretsReader Role
```bash
ibmcloud iam trusted-profile-policy-create <PROFILE_ID> \
  --roles SecretsReader \
  --service-name secrets-manager \
  --service-instance <SECRETS_MANAGER_INSTANCE_ID>
```

🔍 Get instance ID:
```bash
ibmcloud resource service-instances --service-name secrets-manager
```

---

## 🔐 Why Trusted Profiles?

| Capability               | API Key              | Trusted Profile             |
|--------------------------|----------------------|-----------------------------|
| Local credentials needed | ✅ Yes               | ❌ No                       |
| Manual rotation needed   | ✅ Yes               | ❌ No                       |
| Code Engine support      | ⚠️ Manual            | ✅ Native (auto-binding)    |
| Least privilege control  | ❌ Manual            | ✅ Granular IAM policies    |

---

## 📦 Install IBM SDK

```bash
npm install ibm-cloud-sdk-core @ibm-cloud/secrets-manager
```

---

## 📁 Environment Variables (`.env`)

| Variable                   | Description                                   |
|----------------------------|-----------------------------------------------|
| `SM_TRUSTED_PROFILE_ID`    | Profile ID used by Code Engine                |
| `SM_SERVICE_URL`           | Secrets Manager instance URL                  |
| `NEXT_PUBLIC_SECRET_ID`    | Secret ID to retrieve                         |
| `CLOUD_API_KEY`            | Local-only: used to authenticate via SDK      |

> ⚠️ Do not commit `.env` files to source control.

### Example `.env`

```env
# Production (Code Engine)
SM_TRUSTED_PROFILE_ID=crn:v1:bluemix:public:iam-identity::a/...:profile:MyTrustedProfile
SM_SERVICE_URL=https://<GUID>.private.<REGION>.secrets-manager.appdomain.cloud
NEXT_PUBLIC_SECRET_ID=<secret-id>

# Development (local)
CLOUD_API_KEY=<your-api-key>
SM_SERVICE_URL=https://<GUID>.<REGION>.secrets-manager.appdomain.cloud
NEXT_PUBLIC_SECRET_ID=<secret-id>
```

---

## 🧪 Testing

- Access `http://localhost:3000` locally
- When deployed to Code Engine, app auto-authenticates using its bound trusted profile

---

## 📝 Credits

Based on [this blog post on Medium](https://medium.com/@mohamedeshaftri/e2fb11b6857b)
