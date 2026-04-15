import { Navigate } from "react-router-dom"

export function PrivateRoute({ children }) {
    const userInfo = localStorage.getItem("userInfo")

    if (!userInfo) {
        return <Navigate to="/login" replace />
    }

    return children
}
