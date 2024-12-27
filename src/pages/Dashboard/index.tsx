import { UserRole } from "../../types/user"
import AdminDasboard from "./AdminDashboard"
import UserDasboard from "./UserDasboard"

type DashboardProps = {
    userRole: UserRole
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
    return <>{userRole === "Admin" ? <AdminDasboard /> : <UserDasboard />}</>
}

export default Dashboard
