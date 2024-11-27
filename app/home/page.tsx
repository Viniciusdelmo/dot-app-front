"use client";
import React, { useState, useEffect } from "react";
import dotService from "app/services/dotService";
import userService from "app/services/userService";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function ProtectedPage() {
  const { push } = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [points, setPoints] = useState({
    1: "-- : --",
    2: "-- : --",
    3: "-- : --",
    4: "-- : --",
  });
  const [userName, setUserName] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
      push("/login");
    }
  }, [push]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await dotService.findByUser();

      const pointsData = {
        1: "-- : --",
        2: "-- : --",
        3: "-- : --",
        4: "-- : --",
      };

      response.map((point: any) => {
        const timeflag = point.timeflag as 1 | 2 | 3 | 4;
        pointsData[timeflag] = point.dot;
      });

      setPoints(pointsData);
    } catch (error: any) {
      console.error("Erro ao buscar pontos:", error.message);
    }
  };

  const userNameFetch = async () => {
    try {
      const user = await userService.findById();
      if (user && user.login) {
        setUserName(user.login);
      } else {
        console.error("Nome do usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar o nome do usuário:", error);
    }
  };

  useEffect(() => {
    fetchPoints();
    userNameFetch();
  }, []);

  const handleClockIn = async () => {
    const date = new Date();
    const brazilDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);

    try {
      const formattedDate = brazilDate.toISOString();
      const points = await dotService.findByUser();

      const timeFlags = points.map(
        (point: { timeflag: number }) => point.timeflag
      );

      if ([1, 2, 3, 4].every((flag) => timeFlags.includes(flag))) {
        alert("Todos os pontos já foram registrados para hoje.");
        return;
      }

      const nextTimeFlag = Math.min(Math.max(...timeFlags, 0) + 1, 4);

      const response = await dotService.insert({
        dot: formattedDate,
        timeflag: nextTimeFlag,
      });
      await fetchPoints();
    } catch (error: any) {
      console.error("Erro ao registrar ponto:", error);
    }
  };

  const handleLogout = () => {
    window.location.href = "/login";
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userId");
  };

  return (
    <div className="flex flex-col h-screen bg-teal-950 text-white">
      <div className="flex justify-between z-10 mt-4">
      <Image
          src="/assets/uniesquina.svg"
          width={250}
          height={250}
          priority={true}
          alt="Uniesquina"
          className="opacity-75 translate-y-1/3 translate-x-1/3"
        />
      <div className="flex justify-end z-1 align-center h-10">
        <span className="text-white text-lg font-semibold mr-6">
          {userName}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-500 transition cursor-pointer mr-6"
        >
          Sair
        </button>
      </div>
      </div>
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center z-10">
        <div className="text-4xl font-bold suppressHydrationWarning">
          {isClient ? new Date().toLocaleTimeString() : 'Loading...'}
        </div>

        <button
          onClick={handleClockIn}
          className="bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-500 transition"
        >
          Marcar ponto
        </button>

        <div className="w-full max-w-4xl mt-5">
          <table className="table-auto w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 px-4 py-2">Entrada</th>
                <th className="border border-gray-600 px-4 py-2">
                  Início Almoço
                </th>
                <th className="border border-gray-600 px-4 py-2">
                  Término Almoço
                </th>
                <th className="border border-gray-600 px-4 py-2">Saída</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {points[1]}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {points[2]}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {points[3]}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {points[4]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="absolute inset-0">
        <Image
          src="/assets/clock.svg"
          fill
          priority={true}
          alt="Relógio"
          className="opacity-10"
        />
      </div>
    </div>
  );
}
