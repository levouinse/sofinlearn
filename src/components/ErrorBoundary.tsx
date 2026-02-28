import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
          <div className="border border-destructive bg-card p-8 rounded text-center max-w-md">
            <h2 className="font-pixel text-xl text-destructive mb-4">⚠️ Error</h2>
            <p className="font-pixel text-sm text-muted-foreground mb-4">
              Something went wrong. Please reload the page.
            </p>
            {this.state.error && (
              <details className="text-left mb-4">
                <summary className="font-pixel text-xs text-muted-foreground cursor-pointer">
                  Error details
                </summary>
                <pre className="text-[10px] text-destructive mt-2 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-primary text-primary font-pixel text-xs hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
