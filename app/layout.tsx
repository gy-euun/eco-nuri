import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: '에코누리 - 지붕 임대 수익 서비스',
  description: '공장·창고 지붕을 임대하고 안정적인 수익을 받으세요. 초기비용 없음, 관리 부담 없음, 계약으로 확정되는 임대료',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  openGraph: {
    title: '에코누리 - 지붕 임대 수익 서비스',
    description: '공장·창고 지붕을 임대하고 안정적인 수익을 받으세요. 초기비용 없음, 관리 부담 없음, 계약으로 확정되는 임대료',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: '에코누리 ECO-NURI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '에코누리 - 지붕 임대 수익 서비스',
    description: '공장·창고 지붕을 임대하고 안정적인 수익을 받으세요. 초기비용 없음, 관리 부담 없음, 계약으로 확정되는 임대료',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1482027566648346'

  return (
    <html lang="ko">
      <head>
        {/* Meta Pixel Code */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body>{children}</body>
    </html>
  )
}
