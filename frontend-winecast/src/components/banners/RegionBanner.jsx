import { useState, useEffect } from "react";

const RegionBanner = ({ region }) => {
 // Verificar a imagem está a ser mostrada
  const [currentImage, setCurrentImage] = useState(0);

  // Mudar a cada 3 segundos a imagem 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => {
       
        if (prev === region.images.length - 1) {
          return 0; 
        } else {
          return prev + 1; 
        }
      });
    }, 3000);

    // Dar reset ao timer quando saímos da página

    return () => clearInterval(timer);
  }, [region.images.length]);

  // Função para avançar para a próxima imagem ao clicar no botão
  const goToNext = () => {
    if (currentImage === region.images.length - 1) {
      setCurrentImage(0); 
    } else {
      setCurrentImage(currentImage + 1); 
    }
  };

  //Função para avançar para a  imagem  anterior ao clicar no botão
  const goToPrevious = () => {
    if (currentImage === 0) {
      setCurrentImage(region.images.length - 1); 
    } else {
      setCurrentImage(currentImage - 1);
    }
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
      <img
        src={region.images[currentImage]}
        alt={region.name}
        className="w-full h-full object-cover"
      />

      {/* Overlay escuro para o texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

      {/* Texto sobre a imagem */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <h1 className="text-4xl font-bold mb-3">{region.name}</h1>
        <p className="text-lg max-w-3xl">{region.description}</p>
      </div>

      {/* Botão seta esquerda */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-[#8B5E3C]/70 hover:bg-[#6F4B30] text-white rounded-full p-3 transition-all duration-200 shadow-lg"
      >
        <svg
          className="w-6 h-6"
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

      {/* Botão seta direita */}
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-[#8B5E3C]/70 hover:bg-[#6F4B30] text-white rounded-full p-3 transition-all duration-200 shadow-lg"
      >
        <svg
          className="w-6 h-6"
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

        {/* Indicadores (bolinhas) para selecionar a imagem */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {region.images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
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

export default RegionBanner;
