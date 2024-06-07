"use client"

import { useState, useEffect, useRef } from 'react';
import NavBar from '@/components/navbar-m';
import { getMockSensorData, postSensorData } from '@/actions/sensor';

export default function Monitoramento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sensorDataToShow, setSensorDataToShow] = useState([]);
  const [isAutoUpdate, setIsAutoUpdate] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (isAutoUpdate) {
      intervalRef.current = setInterval(fetchAndPostSensorData, 10000); 
      startCountdown();
    } else {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
      intervalRef.current = null;
      countdownRef.current = null;
      setCountdown(10);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, [isAutoUpdate]);

  const startCountdown = () => {
    setCountdown(10);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 10));
    }, 1000);
  };

  const fetchSensorData = async () => {
    try {
      const response = await fetch('https://davinci-ocean.onrender.com/sensor/mock', {
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error("Erro ao obter dados do sensor");
      }

      return response.json();
    } catch (error) {
      throw new Error(error.message || "Erro ao obter dados do sensor");
    }
  };

  const postSensorDataToAPI = async (sensorData) => {
    try {
      for (const sensor of sensorData) {
        const formattedSensor = {
          data: sensor.data,
          localizacao: sensor.localizacao,
          temperatura: sensor.temperatura
        };

        await postSensorData(formattedSensor);
      }
    } catch (error) {
      throw new Error(error.message || "Erro ao enviar dados do sensor");
    }
  };

  const fetchAndPostSensorData = async () => {
    setLoading(true);
    setError(null);

    try {
      const sensorData = await fetchSensorData();
      await postSensorDataToAPI(sensorData);
      setSensorDataToShow(sensorData);
      if (isAutoUpdate) {
        startCountdown(); 
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTemperatureColor = (temperature) => {
    if (temperature < 23) {
      return 'text-blue-500';
    } else if (temperature > 29) {
      return 'text-red-500';
    } else {
      return 'text-green-500';
    }
  };

  return (
    <>
      <NavBar />
      <main className="container bg-cyan-800 mt-10 mx-auto rounded p-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Monitoramento</h2>

        <div className="mb-6">
          <div className="flex justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-2 rounded p-3"></div>
              <span className="              text-gray-100">Temperatura Baixa (&lt; 23°C)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2 rounded p-3"></div>
              <span className="text-gray-100">Temperatura Média (23°C - 29°C)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2 rounded p-3"></div>
              <span className="text-gray-100">Temperatura Alta (&gt; 29°C)</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <button
            onClick={fetchAndPostSensorData}
            className="bg-blue-500 text-white p-2 rounded mr-4"
          >
            Atualizar Sensores
          </button>
          <button
            onClick={() => setIsAutoUpdate(!isAutoUpdate)}
            className={`p-2 rounded ${isAutoUpdate ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            {isAutoUpdate ? 'Parar Atualização Automática' : 'Iniciar Atualização Automática'}
          </button>
          {isAutoUpdate && <span className="text-white ml-4">{countdown}s</span>}
        </div>

        {loading ? (
          <p className="text-center text-gray-100">Carregando...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensorDataToShow.map((sensor, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded shadow-md">
                <p className="text-center text-cyan-500 font-bold mb-2">Sensor {index + 1}</p>
                <p className="text-gray-100">Data: {sensor.data}</p>
                <p className={`${getTemperatureColor(sensor.temperatura)}`}>
                  Temperatura: {sensor.temperatura.toFixed(2)}°C
                </p>
                <p className="text-gray-100">Localização: {sensor.localizacao}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

