import { Navigate } from 'react-router-dom';
import { getRole } from '../utils/auth';

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
}

export default function RoleGuard({ roles, children }: RoleGuardProps) {
  const role = getRole();
  if (!roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
