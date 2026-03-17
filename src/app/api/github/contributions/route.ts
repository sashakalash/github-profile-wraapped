import { getServerSession } from 'next-auth';
import { NextResponse, type NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import { fetchContributions } from '@/lib/github/graphql';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const username = new URL(req.url).searchParams.get('username');
  if (!username) {
    return NextResponse.json({ error: 'missing username' }, { status: 400 });
  }

  const contributions = await fetchContributions(username, session.accessToken);
  if (!contributions) {
    return NextResponse.json({ error: 'failed to fetch contributions' }, { status: 502 });
  }

  return NextResponse.json(contributions);
}
