import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
    const {isLoggedIn, children} = props;
    return(
        isLoggedIn ? children: <Navigate to="/sign-in" replace />
    )
}

export default ProtectedRoute;