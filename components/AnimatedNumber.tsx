'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedNumberProps {
  value: number
  suffix?: string
  duration?: number
  decimals?: number
}

export default function AnimatedNumber({ 
  value, 
  suffix = '', 
  duration = 1500,
  decimals = 0 
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (value - startValue) * easeOut

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, value, duration])

  const formatNumber = (num: number): string => {
    // 만원 단위로 표시 (suffix에 "만 원"이 포함된 경우)
    if (num >= 10000) {
      const 억 = Math.floor(num / 10000)
      const 만 = Math.floor((num % 10000) / 1)
      if (만 > 0) {
        return `${억}억 ${만.toLocaleString()}만`
      }
      return `${억}억`
    }
    return Math.floor(num).toLocaleString()
  }

  return (
    <span ref={elementRef}>
      {formatNumber(displayValue)}{suffix}
    </span>
  )
}
