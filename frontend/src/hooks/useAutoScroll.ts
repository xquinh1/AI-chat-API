import { useEffect, useRef } from 'react'

export function useAutoScroll(dependency: unknown) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [dependency])
  return endRef
}
