'use client';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [secret, setSecret] = useState(null);
  const [error, setError] = useState(null);

  const secretId = process.env.NEXT_PUBLIC_SECRET_ID || "default-fallback-id";
  console.log("Secret ID:", secretId);

  useEffect(() => {
    if (!secretId || secretId === "default-fallback-id") {
      setError("Missing or fallback secret ID");
      return;
    }

    fetch(`/api/get-secret?secretId=${secretId}`)
      .then(res => res.json())
      .then(data => setSecret(data))
      .catch(err => setError(err.message));
  }, [secretId]);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>IBM Secrets Manager Demo (App Router)</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {secret ? (
        <pre>{JSON.stringify(secret, null, 2)}</pre>
      ) : (
        <p>Loading secret...</p>
      )}
    </main>
  );
}
