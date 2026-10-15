"use client"

import { createContext, ReactNode, useContext, useState } from "react"
import { User } from "../types/user";

type UserContextType = {
    user: User | null;
    setUser: (user:User|null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}


export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used with a UserProvider");
    }
    return context;
}