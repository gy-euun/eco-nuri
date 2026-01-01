import { NextRequest, NextResponse } from 'next/server'
import { getInquiryById, updateInquiry, deleteInquiry } from '@/lib/db'
import { authenticateAdmin } from '@/lib/auth'

// 문의 내역 상세 조회 (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await authenticateAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const inquiry = await getInquiryById(params.id)
    if (!inquiry) {
      return NextResponse.json(
        { error: '문의 내역을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ inquiry }, { status: 200 })
  } catch (error) {
    console.error('문의 조회 오류:', error)
    return NextResponse.json(
      { error: '문의 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 문의 내역 업데이트 (PATCH)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await authenticateAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const inquiry = await updateInquiry(params.id, body)
    
    if (!inquiry) {
      return NextResponse.json(
        { error: '문의 내역을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, inquiry }, { status: 200 })
  } catch (error) {
    console.error('문의 업데이트 오류:', error)
    return NextResponse.json(
      { error: '문의 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 문의 내역 삭제 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await authenticateAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const success = await deleteInquiry(params.id)
    if (!success) {
      return NextResponse.json(
        { error: '문의 내역을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('문의 삭제 오류:', error)
    return NextResponse.json(
      { error: '문의 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
