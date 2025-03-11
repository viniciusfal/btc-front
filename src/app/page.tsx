"use client";

import { FileSymlink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import amazoniaImg from "@/assets/amazonia.png"

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
      const response = await fetch("https://btc-api-production.up.railway.app/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao processar o arquivo");

      // Criar um link para baixar o CSV
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "output.xlsx";
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
    <div className="bg-zinc-50 relative ">
      <header className="absolute left-5 top-2">
        <Image src={amazoniaImg} alt="Amazonia Inter" className="w-[120px]" />
      </header>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-zinc-800">UPLOAD DE BTC</h1>
        <div className="flex items-center gap-1 border p-2.5 border-zinc-200 rounded-xl">
          <FileSymlink className={file === null ? "text-zinc-400 size-5 animate-pulse" : "text-emerald-500 size-5"} />
          <input type="file" accept=".xml" onChange={handleFileChange} className="  text-sm text-zinc-800 " />
        </div>
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-emerald-600 text-white px-5 py-2 rounded cursor-pointer hover:bg-emerald-500"
        >
          {loading ? "Enviando..." : "Gerar Dados"}
        </button>
        <footer className="bg-zinc-800 w-full text-zinc-300 fixed bottom-0 p-6 rounded-t text-center text-xs">Copyright &copy; {new Date().getFullYear() + ""} {""}
          Amazônia Inter - Desenvolvido por {<span className="text-zinc-400">Vinicius Silva</span>}</footer>
      </div>
    </div>
  );
}
