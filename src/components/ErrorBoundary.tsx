import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BIS Sahayak AI Uncaught Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#welcome';
    window.location.reload();
  };

  private handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    this.handleReset();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 font-mono">
          <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-xs font-bold uppercase text-zinc-400">
              [ OPERATIONAL RECOVERY ]
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold font-display text-white font-sans">
                BIS Sahayak AI - System Recovery
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                An unexpected interface anomaly was detected. The core deterministic Indian Standards knowledge base remains intact and secure.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 overflow-x-auto space-y-1">
                <div className="text-zinc-500 font-bold uppercase text-[10px]">
                  [ Diagnostic Summary ]:
                </div>
                <div>{this.state.error.toString()}</div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 text-xs">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase"
              >
                [ Reload Application ]
              </button>

              <button
                type="button"
                onClick={this.handleClearCacheAndReload}
                className="w-full sm:w-auto py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-zinc-700 uppercase"
              >
                [ Reset to Welcome ]
              </button>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 uppercase">
              <span>National Standards Decision Support</span>
              <span>Ref: SIH26107</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
