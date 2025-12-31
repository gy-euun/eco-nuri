import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: '로그아웃 성공' },
    { status: 200 }
  )

  // 쿠키 삭제
  response.cookies.delete('admin_token')

  return response
}
