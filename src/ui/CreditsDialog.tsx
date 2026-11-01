import { useRef } from 'react'
import styles from './CreditsDialog.module.css'

/**
 * "Créditos" button + screen. Uses the native <dialog>: showModal() already
 * traps focus inside, closes on Esc and returns focus to the button, which
 * would take a lot of hand-written code to get right otherwise.
 * Text only, no links (project rule).
 */
export function CreditsDialog() {
  const dialog = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        Créditos
      </button>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="credits-title"
        // Clicking the dimmed backdrop (the dialog element itself, outside
        // its content box) closes it, as users expect from a modal.
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
      >
        <div className={styles.content}>
          <h2 id="credits-title" className={styles.title}>
            Créditos
          </h2>
          <dl className={styles.list}>
            <dt>Projeto</dt>
            <dd>
              Desenhado por Kalane Maciel, estudante de Engenharia de Software, como aplicativo
              de aula prática
            </dd>
            <dt>Desenvolvimento</dt>
            <dd>Claude Code, utilizado para acelerar o processo de desenvolvimento</dd>
            <dt>Texturas dos corpos celestes</dt>
            <dd>Solar System Scope, licença CC BY 4.0</dd>
            <dt>Dados</dt>
            <dd>NASA Planetary Fact Sheet, Sun Fact Sheet e Moon Fact Sheet</dd>
            <dt>Fontes tipográficas</dt>
            <dd>Inter e Space Grotesk, licença SIL Open Font License</dd>
          </dl>
          <p className={styles.note}>
            Na Visão Sistema, tamanhos e distâncias ficam fora de escala para que todos os corpos
            caibam na tela. O botão Escala real mostra as proporções verdadeiras.
          </p>
          <button type="button" className={styles.close} onClick={() => dialog.current?.close()}>
            Fechar
          </button>
        </div>
      </dialog>
    </>
  )
}
