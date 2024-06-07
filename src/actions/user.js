"use server"

import { cookies } from 'next/headers'
const API_URL = "https://davinci-ocean.onrender.com";

export async function apiLogin(email, senha) {
    const url = `${API_URL}/login`;

    const options = {
        method: "POST", 
        body: JSON.stringify({ email, senha }),
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const resp = await fetch(url, options);

        if (resp.status !== 200) {
            throw new Error("Falha no login");
        }

        const json = await resp.json();

        cookies().set('oceanapi_jwt', json.token, {
            maxAge: 60 * 60 * 24 * 7 
        });

        return json;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
}

export async function apiLogout() {
    cookies().delete('oceanapi_jwt');
}