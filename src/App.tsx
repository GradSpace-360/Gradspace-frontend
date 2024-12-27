import { Route, Routes } from "react-router-dom"

import Login from "./pages/Auth/Login"
import Signup from "./pages/Auth/SignUp"
import Dashboard from "./pages/Dashboard"
import DevInfo from "./pages/DevInfo"
import Home from "./pages/Home"

// take user role from store of auth. setup Zustand store
const userRole = "Student"

const App = () => {
    return (
        // implement protected routes, redirectAuthenticated routes
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* user role from store of auth. setup Zustand store  */}
            <Route
                path="/dashboard"
                element={<Dashboard userRole={userRole} />}
            />
            <Route path="devinfo" element={<DevInfo />} />
            {/* handle page not found */}
            <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
    )
}

export default App
