// 관리자 계정 생성 스크립트
// 실행: npx tsx scripts/seed-admin.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 관리자 계정 생성 (비밀번호: admin123)
  const admin = await prisma.admin.upsert({
    where: { username: 'kosecorp' },
    update: {},
    create: {
      id: 'admin-001',
      username: 'kosecorp',
      password: '$2a$10$RefDgZ88MGhYhtofmB1kyOULuPJXJErNkup5.BphEk6qpiDzHajOi', // admin123
    },
  })

  console.log('✅ 관리자 계정 생성 완료:', admin)

  // 초기 통계 생성
  const stats = await prisma.stats.upsert({
    where: { id: 'stats-001' },
    update: {},
    create: {
      id: 'stats-001',
      totalInquiries: 0,
      totalCalculations: 0,
      inquiriesByBuildingType: {},
      inquiriesByDate: {},
    },
  })

  console.log('✅ 초기 통계 생성 완료:', stats)
}

main()
  .catch((e) => {
    console.error('❌ 오류 발생:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
