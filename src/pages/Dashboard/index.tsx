import AdminDasboard from "@/components/Dashboard/AdminDashboard"
import UserDasboard from "@/components/Dashboard/UserDashboard"
import { UserRole } from "@/types/user"

type DashboardProps = {
    userRole: UserRole
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
    return <>{userRole === "Admin" ? <AdminDasboard /> : <UserDasboard />}</>
}

export default Dashboard
