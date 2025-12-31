// Supabase 사용
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 서버 사이드용 클라이언트 (service_role key 사용)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export interface Inquiry {
  id: string
  name: string
  phone: string
  buildingType: string
  address: string
  area: string | null
  areaUnit: 'pyeong' | 'sqm'
  createdAt: Date
  status: 'pending' | 'contacted' | 'completed' | 'rejected'
  notes: string | null
}

export interface Stats {
  totalInquiries: number
  totalCalculations: number
  inquiriesByBuildingType: Record<string, number>
  inquiriesByDate: Record<string, number>
}

// 문의 내역 저장
export const saveInquiry = async (
  inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>
): Promise<Inquiry> => {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([{
      name: inquiry.name,
      phone: inquiry.phone,
      building_type: inquiry.buildingType,
      address: inquiry.address,
      area: inquiry.area || null,
      area_unit: inquiry.areaUnit,
      status: 'pending'
    }])
    .select()
    .single()

  if (error) throw error

  // 통계 업데이트
  await updateStats(inquiry.buildingType)

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    buildingType: data.building_type,
    address: data.address,
    area: data.area,
    areaUnit: data.area_unit as 'pyeong' | 'sqm',
    createdAt: new Date(data.created_at),
    status: data.status as Inquiry['status'],
    notes: data.notes
  }
}

// 문의 내역 조회
export const getInquiries = async (): Promise<Inquiry[]> => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map(inq => ({
    id: inq.id,
    name: inq.name,
    phone: inq.phone,
    buildingType: inq.building_type,
    address: inq.address,
    area: inq.area,
    areaUnit: inq.area_unit as 'pyeong' | 'sqm',
    createdAt: new Date(inq.created_at),
    status: inq.status as Inquiry['status'],
    notes: inq.notes
  }))
}

// 문의 내역 ID로 조회
export const getInquiryById = async (id: string): Promise<Inquiry | null> => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    buildingType: data.building_type,
    address: data.address,
    area: data.area,
    areaUnit: data.area_unit as 'pyeong' | 'sqm',
    createdAt: new Date(data.created_at),
    status: data.status as Inquiry['status'],
    notes: data.notes
  }
}

// 문의 내역 업데이트
export const updateInquiry = async (
  id: string,
  updates: Partial<Inquiry>
): Promise<Inquiry | null> => {
  const updateData: any = {}
  if (updates.status) updateData.status = updates.status
  if (updates.notes !== undefined) updateData.notes = updates.notes

  const { data, error } = await supabase
    .from('inquiries')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    buildingType: data.building_type,
    address: data.address,
    area: data.area,
    areaUnit: data.area_unit as 'pyeong' | 'sqm',
    createdAt: new Date(data.created_at),
    status: data.status as Inquiry['status'],
    notes: data.notes
  }
}

// 문의 내역 삭제
export const deleteInquiry = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', id)

  return !error
}

// 통계 조회
export const getStats = async (): Promise<Stats> => {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('id', 'stats-001')
    .single()

  if (error || !data) {
    // 초기 통계 생성
    const { data: newStats } = await supabase
      .from('stats')
      .insert([{
        id: 'stats-001',
        total_inquiries: 0,
        total_calculations: 0,
        inquiries_by_building_type: {},
        inquiries_by_date: {}
      }])
      .select()
      .single()

    if (!newStats) {
      return {
        totalInquiries: 0,
        totalCalculations: 0,
        inquiriesByBuildingType: {},
        inquiriesByDate: {}
      }
    }

    return {
      totalInquiries: newStats.total_inquiries,
      totalCalculations: newStats.total_calculations,
      inquiriesByBuildingType: (newStats.inquiries_by_building_type as Record<string, number>) || {},
      inquiriesByDate: (newStats.inquiries_by_date as Record<string, number>) || {}
    }
  }

  return {
    totalInquiries: data.total_inquiries,
    totalCalculations: data.total_calculations,
    inquiriesByBuildingType: (data.inquiries_by_building_type as Record<string, number>) || {},
    inquiriesByDate: (data.inquiries_by_date as Record<string, number>) || {}
  }
}

// 통계 업데이트
const updateStats = async (buildingType: string) => {
  const currentStats = await getStats()
  const today = new Date().toISOString().split('T')[0]

  const updatedStats = {
    total_inquiries: currentStats.totalInquiries + 1,
    inquiries_by_building_type: {
      ...currentStats.inquiriesByBuildingType,
      [buildingType]: (currentStats.inquiriesByBuildingType[buildingType] || 0) + 1
    },
    inquiries_by_date: {
      ...currentStats.inquiriesByDate,
      [today]: (currentStats.inquiriesByDate[today] || 0) + 1
    }
  }

  await supabase
    .from('stats')
    .update(updatedStats)
    .eq('id', 'stats-001')
}

// 계산 통계 증가
export const incrementCalculationCount = async () => {
  const currentStats = await getStats()

  await supabase
    .from('stats')
    .update({
      total_calculations: currentStats.totalCalculations + 1
    })
    .eq('id', 'stats-001')
}

// 관리자 정보 조회
export const getAdmin = async () => {
  const { data, error } = await supabase
    .from('admin')
    .select('*')
    .eq('username', 'kosecorp')
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    username: data.username,
    password: data.password,
    createdAt: new Date(data.created_at)
  }
}
