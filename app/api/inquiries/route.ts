import { NextRequest, NextResponse } from 'next/server'
import { saveInquiry, getInquiries } from '@/lib/db'
import { authenticateAdmin } from '@/lib/auth'

// 문의 내역 제출 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, buildingType, address, area, areaUnit } = body

    // 필수 필드 검증
    if (!name || !phone || !buildingType || !address) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    const inquiry = await saveInquiry({
      name,
      phone,
      buildingType,
      address,
      area: area || '',
      areaUnit: areaUnit || 'pyeong',
      notes: null
    })

    return NextResponse.json({ success: true, inquiry }, { status: 201 })
  } catch (error) {
    console.error('문의 제출 오류:', error)
    return NextResponse.json(
      { error: '문의 제출 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 문의 내역 조회 (GET) - 관리자만
export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const inquiries = getInquiries()
    return NextResponse.json({ inquiries }, { status: 200 })
  } catch (error) {
    console.error('문의 조회 오류:', error)
    return NextResponse.json(
      { error: '문의 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
