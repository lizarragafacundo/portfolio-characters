'use client'

import { useState } from 'react'
import {
  DeskCharacter,
  MOTIONS,
  THEMES,
  type MotionName,
  type ThemeName,
} from '@lizdevs/desk-character'
import { exampleDesigner, facundo } from '@lizdevs/desk-character/personas'

const PERSONAS = { facundo, exampleDesigner }
type PersonaName = keyof typeof PERSONAS

const Page = () => {
  const [persona, setPersona] = useState<PersonaName>('facundo')
  const [theme, setTheme] = useState<ThemeName>('light')
  const [motion, setMotion] = useState<MotionName>('Cascada')
  const [ambient, setAmbient] = useState(true)
  const [terminal, setTerminal] = useState(true)

  return (
    <DeskCharacter
      persona={PERSONAS[persona]}
      theme={theme}
      dockMotion={motion}
      ambient={ambient}
      terminal={terminal}
    >
      <div className="controls" style={{ color: THEMES[theme].ink }}>
        <label>
          persona
          <select value={persona} onChange={(e) => setPersona(e.target.value as PersonaName)}>
            {Object.keys(PERSONAS).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>
        </label>

        <label>
          theme
          <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeName)}>
            {Object.keys(THEMES).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>
        </label>

        <label>
          dock motion
          <select value={motion} onChange={(e) => setMotion(e.target.value as MotionName)}>
            {Object.keys(MOTIONS).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>
        </label>

        <label>
          ambient
          <input type="checkbox" checked={ambient} onChange={(e) => setAmbient(e.target.checked)} />
        </label>

        <label>
          terminal
          <input
            type="checkbox"
            checked={terminal}
            onChange={(e) => setTerminal(e.target.checked)}
          />
        </label>
      </div>

      <div className="filler" style={{ color: THEMES[theme].ink }}>
        <div />
        <div />
        <div />
        <div />
      </div>
    </DeskCharacter>
  )
}

export default Page
