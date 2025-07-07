import { useState, useCallback } from 'react'

export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null)

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  const captureError = useCallback((error: Error) => {
    setError(error)
  }, [])

  if (error) {
    throw error
  }

  return { captureError, resetError }
}

export default useErrorBoundary