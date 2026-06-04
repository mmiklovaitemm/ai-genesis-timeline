'use client'

import { useEffect, useState } from 'react'

export function useSessionId(): string {
  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    let id = localStorage.getItem('ai_genesis_session')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('ai_genesis_session', id)
    }
    setSessionId(id)
  }, [])

  return sessionId
}
