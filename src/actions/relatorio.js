"use server"

import { cookies } from 'next/headers'

const API_URL = "https://davinci-ocean.onrender.com";

export async function postRelatorioData(relatorioData) {
    const url = `${API_URL}/relatorio`;

    const token = cookies().get('oceanapi_jwt');

    const options = {
        method: "POST",
        body: JSON.stringify(relatorioData),
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        console.log("Dados enviados para a API:", relatorioData);
        const resp = await fetch(url, options);

        if (!resp.ok) {
            throw new Error("Erro ao enviar dados do relatório");
        }

        return resp.json();
    } catch (error) {
        console.error("Erro ao enviar dados do relatório:", error);
        throw error;
    }
}

export async function getRelatorioData() {
    const url = `${API_URL}/relatorio`;

    try {
        const resp = await fetch(url);

        if (!resp.ok) {
            throw new Error("Erro ao obter dados do relatório");
        }

        return resp.json();
    } catch (error) {
        console.error("Erro ao obter dados do relatório:", error);
        throw error;
    }
}
