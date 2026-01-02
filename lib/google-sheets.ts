import { google } from 'googleapis'

// Google Sheets API 클라이언트 생성
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const authClient = await auth.getClient()
  return google.sheets({ version: 'v4', auth: authClient })
}

// 면적을 평으로 변환
function convertToPyeong(area: string, unit: 'pyeong' | 'sqm'): number {
  const areaNum = parseFloat(area) || 0
  if (unit === 'sqm') {
    return Math.round((areaNum / 3.3058) * 10) / 10 // 1평 = 3.3058m²
  }
  return areaNum
}

// 발전 용량 계산 (1.5평당 1kW)
function calculateCapacity(pyeong: number): number {
  if (pyeong <= 0) return 0
  return Math.floor((pyeong / 1.5) * 10) / 10
}

// 수익금 계산 (kW * 200,000원)
function calculateRevenue(capacity: number): number {
  return Math.floor(capacity * 200000)
}

// Google Sheets에 문의 데이터 추가
export async function addInquiryToSheets(inquiry: {
  name: string
  phone: string
  buildingType: string
  address: string
  area: string | null
  areaUnit: 'pyeong' | 'sqm'
  createdAt: Date
}) {
  try {
    // 환경 변수 확인
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      console.warn('Google Sheets 환경 변수가 설정되지 않았습니다. Google Sheets에 데이터를 추가하지 않습니다.')
      return
    }

    const sheets = await getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    // 면적 및 수익 계산
    const pyeongArea = inquiry.area ? convertToPyeong(inquiry.area, inquiry.areaUnit) : 0
    const capacity = calculateCapacity(pyeongArea)
    const revenue = calculateRevenue(capacity)

    // 날짜 포맷 (YYYY-MM-DD HH:mm:ss)
    const dateStr = new Date(inquiry.createdAt).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(/\. /g, '-').replace(/\./g, '').replace(/, /g, ' ')

    // 행 데이터 준비
    const rowData = [
      dateStr, // 수집일시
      inquiry.name, // 이름
      inquiry.phone, // 연락처
      inquiry.address, // 건물주소
      inquiry.buildingType, // 건물유형
      pyeongArea > 0 ? pyeongArea.toString() : '', // 지붕면적(평)
      revenue > 0 ? revenue.toString() : '', // 예상수익금
    ]

    // 시트에 데이터 추가
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: '시트1!A:G', // 시트 이름과 범위
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    })

    console.log('Google Sheets에 데이터가 성공적으로 추가되었습니다.')
  } catch (error) {
    // Google Sheets 오류는 전체 프로세스를 중단하지 않도록 로그만 남김
    console.error('Google Sheets 데이터 추가 오류:', error)
  }
}
