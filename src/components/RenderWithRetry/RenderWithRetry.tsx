import React, { useState, useEffect } from 'react';

type renderWithRetryProps = {
    onRender: any,
    onError: any,
}

function RenderWithRetry({ onRender, onError }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [onRender]);

  const handleRetry = () => {
    setHasError(false);
  };

  try {
    return hasError ? onError(handleRetry) : onRender();
  } catch (error) {
    setHasError(true);
    return onError(handleRetry);
  }
}

export default RenderWithRetry;