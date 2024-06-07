"use client"

import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function NavBar() {
    const { push } = useRouter()
    const { user, logout } = useContext(AuthContext)

    const handleLogout = () => {
        logout()
        push("/")
    }

    return (
        <nav className="flex items-center justify-between bg-cyan-800 p-6">
            <ul className="flex items-end gap-14 text-slate-500">
                <li>
                    <Link href="/">
                        <h1 className="text-2xl font-bold text-center text-white">
                            <span className="text-cyan-500">DaVinci</span>{" "}
                            <span>Ocean</span>
                        </h1>

                    </Link>
                </li>

                <li>
                    <Link href="/monitoramento">
                        <h1 className="text-1xl font-bold text-center text-gray-100 hover:text-cyan-500">
                            <span>monitoramento</span>
                        </h1>
                    </Link>
                </li>

                <li>
                    <Link href="/relatorio">
                        <h1 className="text-1xl font-bold text-center text-cyan-500">
                            <span>relatorio</span>
                        </h1>
                    </Link>
                </li>
            </ul>

            <div className="flex gap-2 items-center">
                {user?.email}
                <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src="https://github.com/cassiyu.png" alt="avatar do usuário" />
                </div>
                <button onClick={handleLogout}>Sair</button>
            </div>
        </nav>

    )
}