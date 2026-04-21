import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

export default function ErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage: string;
  let errorTitle: string;

  if (isRouteErrorResponse(error)) {
    // Handle route errors (404, etc.)
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || 'The page you are looking for does not exist.';
  } else if (error instanceof Error) {
    // Handle regular JavaScript errors
    errorTitle = 'Oops! Something went wrong';
    errorMessage = error.message;
  } else {
    // Handle unknown errors
    errorTitle = 'Oops! Something went wrong';
    errorMessage = 'An unexpected error occurred.';
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center">
        <div className="mb-6">
          <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {errorTitle}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Don't worry, we're here to help!
          </p>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
          <p className="text-red-700 font-medium mb-2">Error Details:</p>
          <p className="text-red-600 text-sm break-words">{errorMessage}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleReload}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 rounded-2xl text-lg flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>
          
          <Link to="/">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-2xl text-lg flex items-center justify-center gap-2 w-full"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem continues, please refresh your browser or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
