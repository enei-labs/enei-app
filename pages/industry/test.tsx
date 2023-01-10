import { useRouter } from "next/router";

export default function Test() {
  const router = useRouter();

  console.log({ router });
  return <div>123</div>;
}
