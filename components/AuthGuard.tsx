import { useAuth } from "../core/context/auth";
import { Role } from "../core/graphql/types";

interface AuthGuardProps {
  roles: Role[];
  children: React.ReactNode;
}

export function AuthGuard(props: AuthGuardProps) {
  const { roles, children } = props;
  const { me } = useAuth();

  if (me && roles.includes(me.role)) return <>{children}</>;

  return null;
}
