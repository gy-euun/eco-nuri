import { ImageResponse } from '@vercel/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = '에코누리 ECO-NURI - 지붕 임대 수익 서비스'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#4f46e5',
              letterSpacing: '-0.02em',
            }}
          >
            ECO-NURI
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#6b7280',
              letterSpacing: '-0.01em',
            }}
          >
            지붕 임대 수익 서비스
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
