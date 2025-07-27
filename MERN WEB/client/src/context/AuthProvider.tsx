import {useEffect, useState} from "react";
import {AuthContext} from "./AuthContext.ts";
import {apiClient, setHeader} from "../services/apiClient.ts";
import router from "../router.tsx";


interface AuthProviderProps{
    children: React.ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const[accessToken, setAccessToken] = useState<string>("")

    const[isAuthenticating, setIsAuthenticate] = useState<boolean>(true)

    const login = (token: string) => {
        setIsLoggedIn(true)
        setAccessToken(token)
    }

    const logout = () => {
        setIsLoggedIn(false);
        setAccessToken("")
        router.navigate("/login")
    }
    useEffect(()=>{
        setHeader(accessToken)
    },[accessToken])

    useEffect(() => {
        //console.log("App Mounted")
        const tryRefresh =async () =>{
            try{
                const result = await apiClient.post("/auth/refresh-token")
                setAccessToken(result.data.accessToken)
                setIsLoggedIn(true)

                const currentPath = window.location.pathname
                if (currentPath === "/login" || currentPath === "/signup" || currentPath === "/"){
                    router.navigate("/dashboard")
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }catch (error) {
                setAccessToken("")
                setIsLoggedIn(false)

            }finally {
                setIsAuthenticate(false)
            }
        }

        tryRefresh()
    }, []);

    return(
        <AuthContext.Provider value={{isLoggedIn, login, logout, isAuthenticating}}>
            {children}
        </AuthContext.Provider>
    )

}