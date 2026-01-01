'use client'

interface EmojiIconProps {
  emoji: string
  size?: number
  className?: string
}

// 간단한 이모지 아이콘 컴포넌트 (SVG 기반)
export default function EmojiIcon({ emoji, size = 24, className = '' }: EmojiIconProps) {
  // SVG로 이모지 렌더링
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
      <text 
        x="50" 
        y="75" 
        font-size="${size * 0.8}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Android Emoji, sans-serif"
      >${emoji}</text>
    </svg>
  `

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        verticalAlign: 'middle',
        lineHeight: 1,
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      role="img"
      aria-label={emoji}
    />
  )
}
