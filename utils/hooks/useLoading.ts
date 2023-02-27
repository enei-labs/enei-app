import { useState } from "react";

export const useLoading = () => {
  const [isLoading, setLoading] = useState(false);

  const loader = (promiseFn: (formData: any) => Promise<void> | undefined) => async (formData: any) => {
    setLoading(true);

    await promiseFn(formData);

    setLoading(false)
  }

  return ({
    isLoading,
    loader,
  })
}