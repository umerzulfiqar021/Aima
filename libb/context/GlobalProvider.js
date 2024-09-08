import { createContext,useContext, useEffect,useState } from "react";
const GlobalContext = createContext();
import { getCurrentUser } from "../appwrite";
export const useGlobalContext = () => useContext (GlobalContext);
const GlobalProvider = ({children}) => {
    const [isLoggedIn,setIsLoggedIn] = useState (false);
    const [user ,setUser] = useState (null);
    const [isLoading,setIsLoading] = useState (true);
    useEffect(()=>{
    getCurrentUser()
    .then((res)=>{
        if (res) {
            setIsLoggedIn(true);
            setUser(res)
        } else {
            setIsLoggedIn(false)
            setUser(null)
        }})
        .catch((error)=>{
            console.log(error)
        })
        .finally (()=>{
            setIsLoading(false)
        })
    
    },[])
    return (
        <GlobalContext.Provider 
        value={{
            isLoggedIn,
            setIsLoading,
            user,
            setUser,
            isLoading,
            
        }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalProvider;