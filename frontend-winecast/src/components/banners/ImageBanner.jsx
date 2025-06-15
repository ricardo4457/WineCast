import { useState, useEffect } from "react";

const ImageBanner = ({ imageSources }) => {
    // Estado para controlar a imagem atual
  const [currentImage, setCurrentImage] = useState(0);

// Efeito para mudar automaticamente de imagem a cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) =>
        prev === imageSources.length - 1 ? 0 : prev + 1
      );
    }, 4000); 

    return () => clearInterval(timer); // Limpa o temporizador ao desmontar
  }, [imageSources.length]);

   // Vai para a próxima imagem manualmente
  const goToNext = () => {
    setCurrentImage((prev) =>
      prev === imageSources.length - 1 ? 0 : prev + 1
    );
  };
 // Vai para a imagem anterior manualment
  const goToPrevious = () => {
    setCurrentImage((prev) =>
      prev === 0 ? imageSources.length - 1 : prev - 1
    );
  };

  // Se não houver imagens, não renderiza nada
  if (!imageSources || imageSources.length === 0) return null;

  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden">
      <img
        src={imageSources[currentImage]}
        alt={`Slide ${currentImage + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      {/* Sobreposição escura por cima da imagem */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Setas de navegação (anterior/próxima) */}
      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={goToPrevious}
          className="bg-[#8B5E3C]/80 hover:bg-[#6F4B30] text-white rounded-full p-2 shadow-md transition-colors duration-200"
        >
           {/* Ícone de seta para a esquerda */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="bg-[#8B5E3C]/80 hover:bg-[#6F4B30] text-white rounded-full p-2 shadow-md transition-colors duration-200"
        >
            {/* Ícone de seta para a direita */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

         {/* Indicadores (bolinhas) para selecionar a imagem */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {imageSources.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentImage
                ? "bg-[#8B5E3C] scale-125"
                : "bg-[#8B5E3C]/50 hover:bg-[#8B5E3C]/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageBanner;
