import { useState } from "react";
import PTPage from "./pages/pt";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  if (currentPage === "pt") {
    return <PTPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">
          Nexform funcionando com Tailwind! ✅
        </h1>
        <p className="text-gray-300 mb-8">
          Escolha um módulo para abrir
        </p>

        <button
          onClick={() => setCurrentPage("pt")}
          className="px-6 py-3 rounded-lg bg-cyan-500 text-gray-900 font-semibold hover:bg-cyan-400 transition"
        >
          Abrir Permissão de Trabalho
        </button>
      </div>
    </div>
  );
}

export default App;