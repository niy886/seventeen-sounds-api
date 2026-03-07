// 俳句 API
import { kv } from '@vercel/kv';

export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  try {
    let haikus;
    if (userId) {
      haikus = await kv.zrevrange(`user:${userId}:haikus`, 0, limit - 1);
    } else {
      haikus = await kv.zrevrange('haikus:global', 0, limit - 1);
    }
    
    return Response.json({ haikus: haikus || [] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, lines, season, author } = body;
    
    if (!userId || !lines) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const haiku = {
      id: `haiku_${Date.now()}`,
      userId,
      lines,
      season,
      author,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    
    // 存储俳句
    await kv.hset(`haiku:${haiku.id}`, haiku);
    
    // 添加到用户列表
    await kv.zadd(`user:${userId}:haikus`, {
      score: Date.now(),
      member: haiku.id
    });
    
    // 添加到全局列表
    await kv.zadd('haikus:global', {
      score: Date.now(),
      member: haiku.id
    });
    
    return Response.json({ haiku });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
