import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PhotoLite Error Caught by Boundary:', error, errorInfo);
  }

  private handleReset = () => {
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-[#1a1a1a] p-6 text-gray-300 select-none">
          <div className="w-full max-w-md rounded border border-black bg-[#2b2b2b] p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-950/50 border border-red-500/50 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Workspace Recovery</h2>
              <p className="mt-1 text-xs text-gray-400">
                An unexpected issue occurred while rendering the photo workspace.
              </p>
              {this.state.error && (
                <div className="mt-3 rounded bg-[#1a1a1a] p-2.5 text-left font-mono text-[11px] text-red-300 border border-black overflow-x-auto max-h-28">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded bg-[#007acc] hover:bg-[#0098ff] px-4 py-2 text-xs font-medium text-white border border-black cursor-pointer shadow transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reload Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
