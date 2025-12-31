// 간단한 JSON 파일 기반 데이터베이스
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// 데이터 디렉토리 생성
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json')
const STATS_FILE = path.join(DATA_DIR, 'stats.json')
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json')

// 초기 데이터 구조
const initInquiries = () => {
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2))
  }
}

const initStats = () => {
  if (!fs.existsSync(STATS_FILE)) {
    fs.writeFileSync(STATS_FILE, JSON.stringify({
      totalInquiries: 0,
      totalCalculations: 0,
      inquiriesByBuildingType: {},
      inquiriesByDate: {}
    }, null, 2))
  }
}

const initAdmin = () => {
  if (!fs.existsSync(ADMIN_FILE)) {
    // 기본 관리자 계정 (비밀번호: admin123)
    // 실제 운영 시에는 반드시 변경해야 합니다
    const defaultAdmin = {
      username: 'kosecorp',
      password: '$2a$10$RefDgZ88MGhYhtofmB1kyOULuPJXJErNkup5.BphEk6qpiDzHajOi', // admin123
      createdAt: new Date().toISOString()
    }
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaultAdmin, null, 2))
  }
}

// 초기화 실행
initInquiries()
initStats()
initAdmin()

// 문의 내역 타입
export interface Inquiry {
  id: string
  name: string
  phone: string
  buildingType: string
  address: string
  area: string
  areaUnit: 'pyeong' | 'sqm'
  createdAt: string
  status: 'pending' | 'contacted' | 'completed' | 'rejected'
  notes?: string
}

// 통계 타입
export interface Stats {
  totalInquiries: number
  totalCalculations: number
  inquiriesByBuildingType: Record<string, number>
  inquiriesByDate: Record<string, number>
}

// 문의 내역 저장
export const saveInquiry = (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry => {
  const inquiries = getInquiries()
  const newInquiry: Inquiry = {
    ...inquiry,
    id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: 'pending'
  }
  inquiries.push(newInquiry)
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2))
  
  // 통계 업데이트
  updateStats(inquiry.buildingType)
  
  return newInquiry
}

// 문의 내역 조회
export const getInquiries = (): Inquiry[] => {
  try {
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// 문의 내역 ID로 조회
export const getInquiryById = (id: string): Inquiry | null => {
  const inquiries = getInquiries()
  return inquiries.find(inq => inq.id === id) || null
}

// 문의 내역 업데이트
export const updateInquiry = (id: string, updates: Partial<Inquiry>): Inquiry | null => {
  const inquiries = getInquiries()
  const index = inquiries.findIndex(inq => inq.id === id)
  if (index === -1) return null
  
  inquiries[index] = { ...inquiries[index], ...updates }
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2))
  return inquiries[index]
}

// 문의 내역 삭제
export const deleteInquiry = (id: string): boolean => {
  const inquiries = getInquiries()
  const filtered = inquiries.filter(inq => inq.id !== id)
  if (filtered.length === inquiries.length) return false
  
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(filtered, null, 2))
  return true
}

// 통계 조회
export const getStats = (): Stats => {
  try {
    const data = fs.readFileSync(STATS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {
      totalInquiries: 0,
      totalCalculations: 0,
      inquiriesByBuildingType: {},
      inquiriesByDate: {}
    }
  }
}

// 통계 업데이트
const updateStats = (buildingType: string) => {
  const stats = getStats()
  stats.totalInquiries += 1
  stats.inquiriesByBuildingType[buildingType] = (stats.inquiriesByBuildingType[buildingType] || 0) + 1
  
  const today = new Date().toISOString().split('T')[0]
  stats.inquiriesByDate[today] = (stats.inquiriesByDate[today] || 0) + 1
  
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2))
}

// 계산 통계 업데이트
export const incrementCalculationCount = () => {
  const stats = getStats()
  stats.totalCalculations += 1
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2))
}

// 관리자 정보 조회
export const getAdmin = () => {
  try {
    const data = fs.readFileSync(ADMIN_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}
