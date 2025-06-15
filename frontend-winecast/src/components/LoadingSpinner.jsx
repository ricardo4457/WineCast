const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    // Container centralizado com espaçamento vertical e cor de texto personalizada
    <div className="flex flex-col items-center justify-center py-12 text-[#5A2C2C]">
      {/* Ícone SVG que gira, simulando um spinner */}

      <svg
        className="animate-spin h-10 w-10 mb-4 text-[#A3B899]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* Círculo externo com opacidade reduzida */}
        <circle
          className="opacity-30"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        {/* Parte preenchida do spinner que gira */}
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {/* Texto que aparece abaixo do spinner */}
      <p className="text-lg font-medium text-[#5A2C2C]">
        {text.includes("A Carregar") // Se o texto contém "A Carregar", substitui "A Carrega" por "A Crescer Vinha" e adiciona "..."
          ? text.replace("A Carregar", "A Crescer Vinha") + "..." // Senão, mostra o texto original
          : text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
