"use client"

import { useUser } from "@/app/context/UserContext"
import { useEffect, useState } from "react";

import { getAccounts } from "@/app/lib/api/accounts";
import { Account } from "@/app/types/account";


export default function Dashboard() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    const {user} = useUser();

    async function getAllAccounts(id: number){
        const accountList: Account[] = await getAccounts(id);
    console.log("accountList: ");
        console.log(accountList);
    }

    // create 'User' section
        // allow them to update info.
    // create 'My accounts' section
        // allow them to create new accounts
    // create 'My budgets' section
        // allow them to create budgets
    // create 'transactions' section
        // show up to 10 transactions
        // allow them to to filter by date range, category, and accountType(CHECKING/SAVINGS)

    useEffect(() => {
        if (!user){
            return
        }
        console.log("user's id is: " + user.id);
        getAllAccounts(user.id);
        console.log("hello");

    },[]);

    if (!user){
        return <p>No information to display.</p>
    }

    return (
        <>
        <main>
            <h1>Welcome, {user.firstName}!</h1>
            <section>
                User
                <div></div>
            </section>
            <section>
                Account.
            </section>
            <section>
                Budget.
            </section>
            <section>
                transactions.
            </section>
        </main>
        </>
    )
}