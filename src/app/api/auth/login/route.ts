import { User } from '@/models/user';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    
    const { email, password } = await req.json();

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      );
    }

    // 验证密码
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: '登录成功',
      token,
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