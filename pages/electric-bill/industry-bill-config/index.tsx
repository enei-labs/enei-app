import { useRouter } from "next/router";
import { useEffect } from "react";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/electric-bill");
  }, [router]);

  return <p>redirecting...</p>;
}
