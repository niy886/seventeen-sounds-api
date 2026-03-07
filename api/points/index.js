// 点数 API
import { kv } from '@vercel/kv';

export const runtime = 'nodejs';

// 获取点数
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return Response.json({ error: 'userId required' }, { status: 400 });
  }
  
  try {
    const points = await kv.get(`points:${userId}`);
    return Response.json({ points: points || 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// 消耗/增加点数
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, amount, type } = body; // type: 'consume' | 'add'
    
    if (!userId || !amount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    let currentPoints = await kv.get(`points:${userId}`) || 0;
    
    if (type === 'consume') {
      if (currentPoints < amount) {
        return Response.json({ error: 'Insufficient points', points: currentPoints }, { status: 400 });
      }
      currentPoints -= amount;
    } else {
      currentPoints += amount;
    }
    
    await kv.set(`points:${userId}`, currentPoints);
    
    // 记录点数变化
    await kv.lpush(`points:log:${userId}`, {
      amount,
      type,
      balance: currentPoints,
      createdAt: new Date().toISOString(),
    });
    
    return Response.json({ points: currentPoints });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
