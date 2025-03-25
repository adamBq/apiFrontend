import ProtectedRoute from "@/components/protected-route"

export default function DashboardLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

