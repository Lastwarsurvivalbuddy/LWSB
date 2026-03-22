'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  label?: string // e.g. "Daily Briefing" — used in the default fallback message
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message ?? 'Unknown error' }
  }

  componentDidCatch(error: Error) {
    // Non-fatal — log to console only. Add external logging here if needed later.
    console.error(`[ErrorBoundary${this.props.label ? ` · ${this.props.label}` : ''}]`, error)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-900/30 border border-red-800/40 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 16 16">
                <path d="M8 5v4M8 11v1M2 14h12L8 2 2 14z"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-300">
                {this.props.label ?? 'This section'} failed to load
              </p>
              <p className="text-xs text-zinc-600 mt-0.5">
                Refresh the page to try again. Rest of your dashboard is unaffected.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
