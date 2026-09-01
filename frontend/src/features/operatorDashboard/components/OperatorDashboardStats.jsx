import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import { BookCopy, AlertTriangle, Library, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Link } from "react-router-dom";

const STAT_CARDS = [
    { key: "activeLoans", label: "Prestiti attivi", icon: BookCopy, to: "/admin/loans?status=active" },
    { key: "overdueLoans", label: "Prestiti scaduti", icon: AlertTriangle, destructive: true, to: "/admin/loans?status=overdue" },
    { key: "availableItems", label: "Copie disponibili", icon: Library },
    { key: "totalUsers", label: "Utenti registrati", icon: Users },
];

export default function DashboardStats({ stats, loading }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map(({ key, label, icon: Icon, destructive, to }) => {
                const isDestructiveActive = destructive && stats?.[key] > 0;

                const card = (
                    <Card className={`h-full ${isDestructiveActive ? "border-destructive/50" : ""} ${to ? "transition-colors hover:border-primary/50 hover:bg-muted/30 cursor-pointer" : ""}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                            <Icon className={`h-4 w-4 ${isDestructiveActive ? "text-destructive" : "text-muted-foreground"}`} />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <span className={`text-2xl font-bold ${isDestructiveActive ? "text-destructive" : ""}`}>
                                    {stats?.[key] ?? 0}
                                </span>
                            )}
                        </CardContent>
                    </Card>
                );

                return to ? (
                    <Link key={key} to={to} className="block">{card}</Link>
                ) : (
                    <div key={key}>{card}</div>
                );
            })}
        </div>
    );
}