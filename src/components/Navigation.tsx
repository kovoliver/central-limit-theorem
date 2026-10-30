import { NavLink } from "react-router-dom";

export function Navigation() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
            <div className="container justify-content-center">
                <div className="d-flex gap-2 flex-wrap justify-content-center">
                    <NavLink
                        to="/distribution/central-limit-theorem"
                        className={({ isActive }) =>
                            `btn btn-outline-light px-3 py-2 ${isActive ? "active" : ""}`
                        }
                    >
                        Centrális határeloszlás-tétel
                    </NavLink>

                    <NavLink
                        to="/distribution/normal-distribution"
                        className={({ isActive }) =>
                            `btn btn-outline-light px-3 py-2 ${isActive ? "active" : ""}`
                        }
                    >
                        Standard normális eloszlás
                    </NavLink>

                    <NavLink
                        to="/distribution/chi-squared"
                        className={({ isActive }) =>
                            `btn btn-outline-light px-3 py-2 ${isActive ? "active" : ""}`
                        }
                    >
                        Khi-négyzet-eloszlás
                    </NavLink>

                    <NavLink
                        to="/distribution/student"
                        className={({ isActive }) =>
                            `btn btn-outline-light px-3 py-2 ${isActive ? "active" : ""}`
                        }
                    >
                        Student eloszlás
                    </NavLink>

                    <NavLink
                        to="/distribution/f-distribution"
                        className={({ isActive }) =>
                            `btn btn-outline-light px-3 py-2 ${isActive ? "active" : ""}`
                        }
                    >
                        F-eloszlás
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}