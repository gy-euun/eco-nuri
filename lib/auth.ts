// 간단한 인증 시스템
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getAdmin } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export interface AdminUser {
  username: string
}

// 비밀번호 검증
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// JWT 토큰 생성
export const generateToken = (username: string): string => {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// JWT 토큰 검증
export const verifyToken = (token: string): AdminUser | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string }
    return { username: decoded.username }
  } catch {
    return null
  }
}

// 요청에서 토큰 추출
export const getTokenFromRequest = (req: NextRequest): string | null => {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // 쿠키에서도 확인
  const cookieToken = req.cookies.get('admin_token')?.value
  return cookieToken || null
}

// 관리자 인증 미들웨어
export const authenticateAdmin = async (req: NextRequest): Promise<AdminUser | null> => {
  const token = getTokenFromRequest(req)
  if (!token) return null
  
  return verifyToken(token)
}

// 로그인 처리
export const login = async (username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> => {
  const admin = await getAdmin()
  if (!admin || admin.username !== username) {
    return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' }
  }
  
  const isValid = await verifyPassword(password, admin.password)
  if (!isValid) {
    return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' }
  }
  
  const token = generateToken(username)
  return { success: true, token }
}
