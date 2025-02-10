import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ErrorPage = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsClient(true); // Set client-side rendering flag
  }, []);

  if (!isClient) {
    return null; // Don't render anything on the server side
  }

  const { error } = router.query; // Get the error query parameter
  let errorMessage = 'An unknown error occurred.';

  // Set the appropriate error message based on the error query
  if (error === 'OAuthSignin') {
    errorMessage = 'There was an issue with OAuth sign-in. Please try again.';
  }

  return (
    <div>
      <h1>Error</h1>
      <p>{errorMessage}</p>
    </div>
  );
};

export default ErrorPage;