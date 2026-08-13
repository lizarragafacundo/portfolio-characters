'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface UsageSnippetProps {
  code: string
  classNames?: { panel?: string; code?: string; button?: string }
}

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()
  document.execCommand('copy')
  document.body.removeChild(field)
}

export const UsageSnippet = ({ code, classNames }: UsageSnippetProps) => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(() => {
    void copyToClipboard(code).catch(() => undefined)
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <section className={`pcb-panel pcb-panel-dark ${classNames?.panel ?? ''}`}>
      <h3 className="pcb-legend pcb-legend-dark">
        Your component
        <button
          type="button"
          className={`pcb-copy ${copied ? 'pcb-copy-done' : ''} ${classNames?.button ?? ''}`}
          onClick={copy}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </h3>
      <pre className={`pcb-code ${classNames?.code ?? ''}`}>{code}</pre>
    </section>
  )
}
