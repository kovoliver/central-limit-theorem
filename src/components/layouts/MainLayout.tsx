import { Outlet } from "react-router-dom";
import { Navigation } from "../Navigation";

export function MainLayout() {
    return (
        <>
            <Navigation />

            <main>
                <Outlet />
            </main>
        </>
    );
}