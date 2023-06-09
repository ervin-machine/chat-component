import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
    const { loginWithRedirect } = useAuth0();

    const handleLogin = async () => {
        await loginWithRedirect({
          appState: {
            returnTo: "/",
          },
        });
      };

    return (
        <button className="button-login" onClick={handleLogin}>
            Log In
        </button>
    )
}

export default Login