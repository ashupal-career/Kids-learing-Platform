import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center p-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md">
            <div className="text-7xl mb-4">😢</div>
            <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h1>
            <p className="text-white/80 mb-4">Please refresh the page to continue learning</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-all"
            >
              Refresh Page 🔄
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app with error boundary
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Optional: Add service worker for PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// Optional: Log app startup
console.log('🚀 Kids Learning Platform Started!');
console.log('✨ Version: 2.0.0');
console.log('📚 Happy Learning!');

// Optional: Performance monitoring (development only)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development Mode - Debug Info Enabled');
  
  // Log any unhandled errors
  window.addEventListener('error', (event) => {
    console.error('❌ Unhandled error:', event.error);
  });
  
  // Log unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
  });
  
  // Log app ready
  console.log('✅ App ready for development');
}