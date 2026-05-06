import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const GraficoAgendamentos = () => {
  const data = {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Agendamentos',
        data: [12, 18, 9, 15, 20, 7, 3],
        backgroundColor: 'skyblue',
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">📊 Agendamentos por Dia da Semana</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default GraficoAgendamentos;
