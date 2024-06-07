"use client"

import { useState } from 'react';
import NavBar from '@/components/navbar-r';
import { postRelatorioData } from '@/actions/relatorio';
import { getSensorData } from '@/actions/sensor';

export default function RelatorioPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [relatorios, setRelatorios] = useState([]);

  const fetchRelatorios = async () => {
    setLoading(true);
    setError(null);
    try {
      const sensorData = await getSensorData();
      const relatoriosData = calcularRelatorios(sensorData);
      setRelatorios(relatoriosData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calcularRelatorios = (sensorData) => {
    const relatorios = {};

    sensorData.forEach((sensor) => {
      const localizacao = sensor.localizacao;

      if (!relatorios[localizacao]) {
        relatorios[localizacao] = {
          localizacao: localizacao,
          data_inicio: formatarData(sensor.data),
          data_fim: formatarData(sensor.data),
          temperatura_maxima: sensor.temperatura,
          temperatura_minima: sensor.temperatura,
          temperatura_total: sensor.temperatura,
          quantidade: 1,
        };
      } else {
        const relatorio = relatorios[localizacao];
        relatorio.data_inicio = compararData(sensor.data, relatorio.data_inicio) ? formatarData(sensor.data) : relatorio.data_inicio;
        relatorio.data_fim = compararData(sensor.data, relatorio.data_fim) ? formatarData(sensor.data) : relatorio.data_fim;
        relatorio.temperatura_maxima = Math.max(sensor.temperatura, relatorio.temperatura_maxima);
        relatorio.temperatura_minima = Math.min(sensor.temperatura, relatorio.temperatura_minima);
        relatorio.temperatura_total += sensor.temperatura;
        relatorio.quantidade += 1;
      }
    });

    Object.values(relatorios).forEach((relatorio) => {
      relatorio.temperatura_media = relatorio.temperatura_total / relatorio.quantidade;
    });

    return Object.values(relatorios);
  };

  const compararData = (novaData, dataExistente) => {
    const novaDataFormatada = new Date(novaData);
    const dataExistenteFormatada = new Date(dataExistente);
    return novaDataFormatada > dataExistenteFormatada;
  };

  const formatarData = (data) => {
    const dataFormatada = new Date(data);
    const dia = String(dataFormatada.getDate()).padStart(2, '0');
    const mes = String(dataFormatada.getMonth() + 1).padStart(2, '0');
    const ano = dataFormatada.getFullYear();
    const horas = String(dataFormatada.getHours()).padStart(2, '0');
    const minutos = String(dataFormatada.getMinutes()).padStart(2, '0');
    const segundos = String(dataFormatada.getSeconds()).padStart(2, '0');
    return `${dia}-${mes}-${ano}T${horas}:${minutos}:${segundos}`;
  };

  const handleUpdateRelatorios = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all(relatorios.map(async (relatorio) => {
        const relatorioDataToSend = {
          localizacao: relatorio.localizacao,
          data_inicio: relatorio.data_inicio,
          data_fim: relatorio.data_fim,
          temperatura_maxima: relatorio.temperatura_maxima.toFixed(2),
          temperatura_minima: relatorio.temperatura_minima.toFixed(2),
          temperatura_media: relatorio.temperatura_media.toFixed(2),
        };
        console.log("Dados enviados para a API:", relatorioDataToSend);
        await postRelatorioData(relatorioDataToSend);
      }));
      await fetchRelatorios();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <>
      <NavBar />
      <main className="container bg-cyan-800 mt-10 mx-auto rounded p-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Relatório</h2>

        {loading ? (
          <p className="text-center text-gray-100">Carregando...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {relatorios.map((relatorio, index) => (
              <RelatorioCard key={index} relatorio={relatorio} />
            ))}
            <button
              onClick={handleUpdateRelatorios}
              className="bg-blue-500 text-white p-2 rounded mt-4"
            >
              Atualizar
            </button>
          </>
        )}
      </main>
    </>
  );
}

const RelatorioCard = ({ relatorio }) => (
  <div className="bg-gray-800 p-4 rounded shadow-md mb-4">
    <p className="text-center text-cyan-500 font-bold mb-2">{relatorio.localizacao}</p>
    <p className="text-gray-100">Data Início: {relatorio.data_inicio}</p>
    <p className="text-gray-100">Data Fim: {relatorio.data_fim}</p>
    <p className="text-gray-100">Temperatura Média: {relatorio.temperatura_media.toFixed(2)}</p>
    <p className="text-gray-100">Temperatura Máxima: {relatorio.temperatura_maxima.toFixed(2)}</p>
    <p className="text-gray-100">Temperatura Mínima: {relatorio.temperatura_minima.toFixed(2)}</p>
  </div>
);
