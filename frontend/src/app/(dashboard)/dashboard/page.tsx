"use client"

import { useUser } from "@/app/context/UserContext"


export default function Dashboard() {
    const {user} = useUser();

    if (!user){
        return <p>No information to display.</p>
    }

    // 

    return (
        <>
        <h1>Welcome, {user.firstName}!</h1>
        </>
    )
}