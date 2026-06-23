import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error('Unhandled runtime error in React tree:', error, errorInfo);
  }

  private handleResetAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
          <div className="w-full max-w-2xl bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl animate-scaleUp">
            
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display text-slate-100">ตรวจพบข้อผิดพลาดในระบบเว็บแอป</h1>
                <p className="text-sm text-slate-400 font-sans mt-1">An unexpected client-side runtime exception occurred.</p>
              </div>
            </div>

            {/* Error Message */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
              <div className="text-red-400 font-mono text-sm break-all font-semibold select-all mb-2">
                [{this.state.error?.name}] {this.state.error?.message || 'Unknown runtime render error.'}
              </div>
              {this.state.errorInfo && (
                <div className="text-slate-500 font-mono text-xs max-h-48 overflow-y-auto mt-2 space-y-1 block leading-relaxed border-t border-slate-800/60 pt-2 custom-scrollbar">
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="text-slate-300 text-sm mb-8 space-y-2 font-sans bg-slate-950/40 p-4 rounded-xl border border-slate-800/40">
              <span className="font-semibold text-slate-200 block mb-1">💡 คำแนะนำเบื้องต้นเพื่อแก้ปัญหาหน้าขาวล้วน:</span>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>ลองใช้ปุ่ม <strong className="text-yellow-400 font-medium">"ล้างแคชคุกกี้และรีโหลด"</strong> ด้านล่างเพื่อล้างข้อมูลเซสชันเก่าที่อาจขัดแย้ง</li>
                <li>ตรวจสอบอินเทอร์เน็ตว่าสามารถเชื่อมต่อเกตเวย์หรือโหลดไฟล์สคริปต์ได้สมบูรณ์</li>
                <li>เปิดในโหมด "หน้าต่างที่ไม่ระบุตัวตน" (Incognito Mode) เพื่อตัดปัญหาปลั๊กอินส่วนขยายของเบราว์เซอร์</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                id="error-reset-reload-btn"
                onClick={this.handleResetAndReload}
                className="flex-1 py-3 px-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white font-semibold rounded-xl shadow-lg shadow-red-950/20 transition-all font-sans cursor-pointer text-center"
              >
                ล้างแคชคุกกี้และรีโหลด (Reset & Reload)
              </button>
              <button
                type="button"
                id="error-force-reload-btn"
                onClick={() => window.location.reload()}
                className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors font-sans cursor-pointer text-center"
              >
                โหลดหน้านี้ใหม่ (Reload)
              </button>
            </div>

            {/* Technical Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800/40 text-center">
              <p className="text-[11px] text-slate-500 font-mono">
                APP_URI: {window.location.origin} | DOMAIN: {window.location.hostname}
              </p>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
