/*import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx"; // Importa la nuova pagina
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "@/pages/ProfilePage.jsx";
import AddWorkPage from "@/pages/AddWorkPage.jsx";
import WorkDetailPage from "@/pages/WorkDetailPage.jsx";
import CatalogPage from "@/pages/CatalogPage.jsx";

function App() {
    return (
        <div className="min-h-screen bg-background text-foreground">

            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/works/add" element={<AddWorkPage />} />
                    <Route path={"/works/:id"} element={<WorkDetailPage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                </Routes>
            </Router>

        </div>
    );
}

export default App;
 */
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import HomePage        from "./pages/public/HomePage.jsx"
import LoginPage       from "./pages/public/LoginPage.jsx"
import ProfilePage     from "./pages/ProfilePage.jsx"
import AddWorkPage     from "./pages/admin/AddWorkPage.jsx"
import WorkDetailPage  from "./pages/public/WorkDetailPage.jsx"
import CatalogPage     from "./pages/public/CatalogPage.jsx"

import AdminGuard           from "./features/admin/components/AdminGuard.jsx"
import AdminLayout          from "./features/admin/components/AdminLayout.jsx"
import AdminDashboardPage   from "./features/admin/AdminDashboardPage.jsx"
import AdminUsersPage       from "./pages/admin/AdminUsersPage.jsx"
import AdminWorksPage from "@/pages/admin/AdminWorksPage.jsx";
import ForgotPasswordPage from "@/pages/public/ForgotPasswordPage.jsx";
import ResetPasswordPage from "@/pages/public/ResetPasswordPage.jsx";
import SetupAccountPage from "@/pages/public/SetupAccountPage.jsx";
import CardPage from "@/pages/CardPage.jsx";

function App() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Router>
                <Routes>
                    {/* Pubbliche */}
                    <Route path="/"          element={<HomePage />} />
                    <Route path="/login"     element={<LoginPage />} />
                    <Route path="/catalog"   element={<CatalogPage />} />
                    <Route path="/works/:id" element={<WorkDetailPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/setup-account" element={<SetupAccountPage />} />

                    {/* Utente */}
                    <Route path="/profile"   element={<ProfilePage />} />
                    <Route path="/card"    element={<CardPage />} />

                    {/* Admin */}
                    <Route element={<AdminGuard />}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin"        element={<AdminDashboardPage />} />
                            <Route path="/admin/users"  element={<AdminUsersPage />} />
                            <Route path="/admin/works" element={<AdminWorksPage />} />
                            <Route path="/admin/works/add" element={<AddWorkPage />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </div>
    )
}

export default App