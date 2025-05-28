import { NextResponse } from 'next/server';
import secretsManager from '../../../lib/secretsManager';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secretId = searchParams.get('secretId');

  if (!secretId) {
    return NextResponse.json({ error: 'Missing secretId query param' }, { status: 400 });
  }

  try {
    const response = await secretsManager.getSecret({ id: secretId });
    const secret = response.result.data;

    if (!secret) {
      return NextResponse.json({ error: 'Secret not found' }, { status: 404 });
    }

    return NextResponse.json(secret);
  } catch (error) {
    console.error("Secrets Manager Error:", error);
    return NextResponse.json({ error: 'Failed to retrieve secret' }, { status: 500 });
  }
}
