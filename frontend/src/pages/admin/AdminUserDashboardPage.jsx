import { useParams } from "react-router-dom";
import AdminUserDashboard from "@/features/profile/management/AdminUserDashboard.jsx";


export default function AdminUserDashboardPage() {
    const { id } = useParams();
    return <AdminUserDashboard userId={id} />;
}