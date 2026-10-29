import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { MainLayout } from "./components/layouts/MainLayout";
import { Distribution } from "./pages/Distributions";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route
                        index
                        element={<Navigate to="/distribution/normal" replace />}
                    />

                    <Route
                        path="distribution/:type"
                        element={<Distribution />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}