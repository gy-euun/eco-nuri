import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '에코누리 - 지붕 임대 수익 서비스',
  description: '공장·창고 지붕을 임대하고 안정적인 수익을 받으세요. 초기비용 없음, 관리 부담 없음, 계약으로 확정되는 임대료',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
