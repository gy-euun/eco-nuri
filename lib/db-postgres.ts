// Vercel Postgres + Prisma 사용
// lib/db.ts 파일을 이 파일로 교체하세요

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  const newInquiry = await prisma.inquiry.create({
    data: {
      name: inquiry.name,
      phone: inquiry.phone,
      buildingType: inquiry.buildingType,
      address: inquiry.address,
      area: inquiry.area || null,
      areaUnit: inquiry.areaUnit,
      status: 'pending'
    }
  })

  // 통계 업데이트
  await updateStats(inquiry.buildingType)

  return {
    id: newInquiry.id,
    name: newInquiry.name,
    phone: newInquiry.phone,
    buildingType: newInquiry.buildingType,
    address: newInquiry.address,
    area: newInquiry.area,
    areaUnit: newInquiry.areaUnit as 'pyeong' | 'sqm',
    createdAt: newInquiry.createdAt,
    status: newInquiry.status as Inquiry['status'],
    notes: newInquiry.notes
  }
}

// 문의 내역 조회
export const getInquiries = async (): Promise<Inquiry[]> => {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return inquiries.map(inq => ({
    id: inq.id,
    name: inq.name,
    phone: inq.phone,
    buildingType: inq.buildingType,
    address: inq.address,
    area: inq.area,
    areaUnit: inq.areaUnit as 'pyeong' | 'sqm',
    createdAt: inq.createdAt,
    status: inq.status as Inquiry['status'],
    notes: inq.notes
  }))
}

// 문의 내역 ID로 조회
export const getInquiryById = async (id: string): Promise<Inquiry | null> => {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id }
  })

  if (!inquiry) return null

  return {
    id: inquiry.id,
    name: inquiry.name,
    phone: inquiry.phone,
    buildingType: inquiry.buildingType,
    address: inquiry.address,
    area: inquiry.area,
    areaUnit: inquiry.areaUnit as 'pyeong' | 'sqm',
    createdAt: inquiry.createdAt,
    status: inquiry.status as Inquiry['status'],
    notes: inquiry.notes
  }
}

// 문의 내역 업데이트
export const updateInquiry = async (
  id: string,
  updates: Partial<Inquiry>
): Promise<Inquiry | null> => {
  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: {
      ...(updates.status && { status: updates.status }),
      ...(updates.notes !== undefined && { notes: updates.notes })
    }
  })

  return {
    id: inquiry.id,
    name: inquiry.name,
    phone: inquiry.phone,
    buildingType: inquiry.buildingType,
    address: inquiry.address,
    area: inquiry.area,
    areaUnit: inquiry.areaUnit as 'pyeong' | 'sqm',
    createdAt: inquiry.createdAt,
    status: inquiry.status as Inquiry['status'],
    notes: inquiry.notes
  }
}

// 문의 내역 삭제
export const deleteInquiry = async (id: string): Promise<boolean> => {
  try {
    await prisma.inquiry.delete({
      where: { id }
    })
    return true
  } catch {
    return false
  }
}

// 통계 조회
export const getStats = async (): Promise<Stats> => {
  const stats = await prisma.stats.findFirst({
    orderBy: { updatedAt: 'desc' }
  })

  if (!stats) {
    // 초기 통계 생성
    const newStats = await prisma.stats.create({
      data: {
        totalInquiries: 0,
        totalCalculations: 0,
        inquiriesByBuildingType: {},
        inquiriesByDate: {}
      }
    })
    return {
      totalInquiries: newStats.totalInquiries,
      totalCalculations: newStats.totalCalculations,
      inquiriesByBuildingType: (newStats.inquiriesByBuildingType as Record<string, number>) || {},
      inquiriesByDate: (newStats.inquiriesByDate as Record<string, number>) || {}
    }
  }

  return {
    totalInquiries: stats.totalInquiries,
    totalCalculations: stats.totalCalculations,
    inquiriesByBuildingType: (stats.inquiriesByBuildingType as Record<string, number>) || {},
    inquiriesByDate: (stats.inquiriesByDate as Record<string, number>) || {}
  }
}

// 통계 업데이트
const updateStats = async (buildingType: string) => {
  const currentStats = await getStats()
  const today = new Date().toISOString().split('T')[0]

  // 기존 통계 업데이트 또는 새로 생성
  const existingStats = await prisma.stats.findFirst({
    orderBy: { updatedAt: 'desc' }
  })

  if (existingStats) {
    await prisma.stats.update({
      where: { id: existingStats.id },
      data: {
        totalInquiries: currentStats.totalInquiries + 1,
        inquiriesByBuildingType: {
          ...currentStats.inquiriesByBuildingType,
          [buildingType]: (currentStats.inquiriesByBuildingType[buildingType] || 0) + 1
        },
        inquiriesByDate: {
          ...currentStats.inquiriesByDate,
          [today]: (currentStats.inquiriesByDate[today] || 0) + 1
        }
      }
    })
  } else {
    await prisma.stats.create({
      data: {
        totalInquiries: 1,
        totalCalculations: 0,
        inquiriesByBuildingType: {
          [buildingType]: 1
        },
        inquiriesByDate: {
          [today]: 1
        }
      }
    })
  }
}

// 계산 통계 증가
export const incrementCalculationCount = async () => {
  const currentStats = await getStats()
  const existingStats = await prisma.stats.findFirst({
    orderBy: { updatedAt: 'desc' }
  })

  if (existingStats) {
    await prisma.stats.update({
      where: { id: existingStats.id },
      data: {
        totalCalculations: currentStats.totalCalculations + 1
      }
    })
  } else {
    await prisma.stats.create({
      data: {
        totalInquiries: 0,
        totalCalculations: 1,
        inquiriesByBuildingType: {},
        inquiriesByDate: {}
      }
    })
  }
}

// 관리자 정보 조회
export const getAdmin = async () => {
  const admin = await prisma.admin.findFirst({
    where: { username: 'kosecorp' }
  })

  return admin
}
