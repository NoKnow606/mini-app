import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'

// 初始化数据库连接
dbConnect()
  .then(() => console.log('MongoDB 已在中间件中初始化连接'))
  .catch((error) => console.error('MongoDB 连接失败:', error));

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// 配置匹配路径
export const config = {
  matcher: '/api/:path*',
} 