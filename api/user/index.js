// 用户 API
import { kv } from '@vercel/kv';

export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return Response.json({ error: 'userId required' }, { status: 400 });
  }
  
  try {
    const user = await kv.hgetall(`user:${userId}`);
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    return Response.json({ user });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body;
    
    if (!name) {
      return Response.json({ error: 'Name required' }, { status: 400 });
    }
    
    const userId = `user_${Date.now()}`;
    const user = {
      id: userId,
      name,
      email: email || '',
      points: 100, // 新用户赠送 100 点
      createdAt: new Date().toISOString(),
    };
    
    // 存储用户
    await kv.hset(`user:${userId}`, user);
    
    return Response.json({ user });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
