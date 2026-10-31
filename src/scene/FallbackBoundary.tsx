import { Component, type ReactNode } from 'react'

interface Props {
  fallback: ReactNode
  children: ReactNode
}

/**
 * Error boundary for texture loading. A missing or broken texture file must
 * not take the whole scene down: the body just keeps its fallback color.
 * Error boundaries still have to be class components in React.
 */
export class FallbackBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('Textura indisponível, usando cor de fallback.', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
