import { User } from '@/models/user';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  
  try {
    const { username, email, password } = await req.json();

    // 验证用户是否已存在
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名或邮箱已存在' },
        { status: 400 }
      );
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password,
    });

    return NextResponse.json({
      message: '注册成功',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 