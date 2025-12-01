"use client";

import { FileSymlink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import amazoniaImg from "@/assets/amazonia.png";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Selecione um arquivo XML primeiro!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("btc-api-production.up.railway.app/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao processar o arquivo");

      // Criar um link para baixar o CSV
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "output.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar o arquivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 min-h-screen relative">
      <header className="absolute left-6 top-6 z-10">
        <Image 
          src={amazoniaImg} 
          alt="Amazonia Inter" 
          className="w-[140px] drop-shadow-sm transition-opacity hover:opacity-90" 
        />
      </header>
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-24">
        <div className="bg-zinc-50 rounded-2xl shadow-lg shadow-zinc-200/50 p-8 md:p-12 w-full max-w-md border border-zinc-100">
          <div className="flex flex-col items-center gap-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                 DADOS DE DESEMPENHO OPERACIONAL
              </h1>
              <p className="text-sm text-zinc-500 font-medium">
                Selecione um arquivo para processar e gerar os dados de desempenho operacional
              </p>
            </div>
            
            <div className="w-full">
              <label 
                htmlFor="file-input"
                className="flex items-center gap-3 border-2 border-dashed border-zinc-300 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50/30 group"
              >
                <FileSymlink
                  className={
                    file === null
                      ? "text-zinc-400 size-6 transition-all duration-300 group-hover:text-emerald-500"
                      : "text-emerald-500 size-6 transition-all duration-300"
                  }
                />
                <div className="flex-1 min-w-0">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <span className="text-sm text-zinc-700 block truncate pointer-events-none">
                    {file ? (
                      <span className="font-medium text-emerald-600">
                        {file.name}
                      </span>
                    ) : (
                      <span className="text-zinc-500 group-hover:text-zinc-700 transition-colors">
                        Clique para selecionar arquivo
                      </span>
                    )}
                  </span>
                </div>
              </label>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-full bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className=" w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Enviando...
                </span>
              ) : (
                "Gerar Dados"
              )}
            </button>
          </div>
        </div>
      </div>
      
      <footer className="bg-zinc-900/95 backdrop-blur-sm w-full text-zinc-400 fixed bottom-0 py-5 rounded-t-2xl border-t border-zinc-800 text-center text-xs font-medium">
        Copyright &copy; {new Date().getFullYear()} Amazônia Inter - Desenvolvido por{" "}
        <span className="text-zinc-300 font-semibold">Vinicius Silva</span>
      </footer>
    </div>
  );
}
