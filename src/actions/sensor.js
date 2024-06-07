"use server"

import { cookies } from 'next/headers'

const API_URL = "https://davinci-ocean.onrender.com";

export async function postSensorData(sensorData) {
    const url = `${API_URL}/sensor`;

    const token = cookies().get('oceanapi_jwt');

    const options = {
        method: "POST",
        body: JSON.stringify(sensorData),
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const resp = await fetch(url, options);

        if (!resp.ok) {
            throw new Error("Erro ao enviar dados do sensor");
        }

        return resp.json();
    } catch (error) {
        console.error("Erro ao enviar dados do sensor:", error);
        throw error;
    }
}

export async function getSensorData() {
    const url = `${API_URL}/sensor`;

    try {
        const resp = await fetch(url);

        if (!resp.ok) {
            throw new Error("Erro ao obter dados do sensor");
        }

        return resp.json();
    } catch (error) {
        console.error("Erro ao obter dados do sensor:", error);
        throw error;
    }
}

export async function getMockSensorData() {
    const url = `${API_URL}/sensor/mock`;

    try {
        const resp = await fetch(url);

        if (!resp.ok) {
            throw new Error("Erro ao obter dados mock do sensor");
        }

        return resp.json();
    } catch (error) {
        console.error("Erro ao obter dados mock do sensor:", error);
        throw error;
    }
}
