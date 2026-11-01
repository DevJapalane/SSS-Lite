import { useState } from 'react'
import styles from './IosInstallTip.module.css'

const DISMISSED_KEY = 'sss-lite:ios-install-tip-dismissed'

/**
 * iOS never offers to install a web app by itself (Android and desktop
 * Chrome do), so the tip only makes sense there, and only while the app
 * isn't already running from the home screen.
 */
function shouldShowTip(): boolean {
  // iPadOS 13+ reports itself as a Mac; touch support gives it away.
  const isIos =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isInstalled =
    window.matchMedia('(display-mode: standalone)').matches ||
    // Older iOS versions only expose this non-standard flag.
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  return isIos && !isInstalled && !readDismissed()
}

// Private browsing on old Safari throws on any localStorage access; the
// tip then simply shows again next time, which is harmless.
function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

function saveDismissed() {
  try {
    localStorage.setItem(DISMISSED_KEY, '1')
  } catch {
    // See readDismissed.
  }
}

/** Discreet, dismissible "how to install" tip for iPhone and iPad (PB12). */
export function IosInstallTip() {
  // Computed once on mount: the answer doesn't change during a visit.
  const [visible, setVisible] = useState(shouldShowTip)
  if (!visible) return null

  function dismiss() {
    saveDismissed()
    setVisible(false)
  }

  return (
    <aside className={styles.tip} aria-label="Dica de instalação">
      <p className={styles.text}>
        Instale o SSS Lite: toque em <strong>Compartilhar</strong> <ShareIcon /> e depois em{' '}
        <strong>Adicionar à Tela de Início</strong>.
      </p>
      <button type="button" className={styles.close} onClick={dismiss} aria-label="Dispensar dica">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </aside>
  )
}

/** The iOS share glyph (square with an arrow), so the tip matches what's on screen. */
function ShareIcon() {
  return (
    <svg className={styles.share} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 1.5v8M5 4.5l3-3 3 3M5.5 7H4a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
