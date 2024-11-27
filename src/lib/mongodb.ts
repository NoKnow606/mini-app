import mongoose from 'mongoose'

// 首先声明全局类型
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI')
}

// 然后使用声明的类型
let cached = (globalThis as any).mongoose

if (!cached) {
  cached = (globalThis as any).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose
    }) as any
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect