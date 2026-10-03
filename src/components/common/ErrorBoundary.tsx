'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Royal ErrorBoundary] Uncaught runtime error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-beige flex flex-col items-center justify-center p-6 text-royal-brown selection:bg-coral-reef selection:text-cream">
          <div className="max-w-md w-full bg-cream border-2 border-sand rounded-3xl p-8 shadow-2xl text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-coral-reef/20 text-coral-deep mx-auto flex items-center justify-center border border-coral-reef/40">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif font-black text-2xl text-royal-brown tracking-wide">
                Palace Chamber Disrupted
              </h2>
              <p className="text-xs sm:text-sm text-royal-muted leading-relaxed font-medium">
                An unexpected disruption occurred in the royal court. The palace guards have logged the incident.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-beige/60 rounded-xl border border-sand text-left font-mono text-[11px] text-coral-deep break-words max-h-28 overflow-y-auto">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-coral-deep hover:bg-coral-hover text-cream font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore Palace Chamber</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
