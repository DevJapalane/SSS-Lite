import styles from './ConnectionNotice.module.css'
import { useOnline } from './useOnline'

/**
 * Friendly message when the connection drops (PB12: online-only app).
 * What is already on screen keeps working; only textures not loaded yet
 * need the network, so the message says exactly that instead of a generic
 * error. Kept to two lines: on a phone it floats over the top controls.
 */
export function ConnectionNotice() {
  const online = useOnline()
  if (online) return null
  // role="status": screen readers announce it without interrupting.
  return (
    <div className={styles.notice} role="status">
      <strong>Sem conexão.</strong> O que já está na tela continua funcionando; o resto carrega
      quando a internet voltar.
    </div>
  )
}
