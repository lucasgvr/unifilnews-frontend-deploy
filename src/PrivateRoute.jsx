import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "./hooks/useAuth"
import { Loader } from "./components/Loader"

const PrivateRoute = () => {
    const { user, loading } = useAuth()

    return loading ? <Loader /> : user ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute