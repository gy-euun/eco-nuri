import { NextRequest, NextResponse } from 'next/server'
import { getStats, incrementCalculationCount } from '@/lib/db'
import { authenticateAdmin } from '@/lib/auth'

// 통계 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const stats = getStats()
    return NextResponse.json({ stats }, { status: 200 })
  } catch (error) {
    console.error('통계 조회 오류:', error)
    return NextResponse.json(
      { error: '통계 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 계산 통계 증가 (POST)
export async function POST(request: NextRequest) {
  try {
    incrementCalculationCount()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('통계 업데이트 오류:', error)
    return NextResponse.json(
      { error: '통계 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
