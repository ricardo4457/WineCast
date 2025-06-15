const LiveStatusFooter = ({ lastUpdated }) => {
  // Função que calcula há quanto tempo foi a última atualização
  const getTimeAgo = () => {
    if (!lastUpdated) return "";
    // Calcula minutos passados desde lastUpdated até agora
    const minutes = Math.floor((Date.now() - new Date(lastUpdated)) / 60000);
    // Se passou menos de 1 minuto, retorna "Agora", senão retorna "Xm atrás"

    return minutes < 1 ? "Agora" : `${minutes}m atrás`;
  };

  return (
    // Container fixo no canto inferior direito da página
    <div className="fixed bottom-4 right-4 bg-[#F5E1DA] shadow-md rounded-full px-4 py-2 text-sm border border-[#E8D0A9]">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-[#A3B899] rounded-full animate-pulse" />
        <span className="text-[#5A2C2C] font-medium">Live</span>
        {lastUpdated && (
          <span className="text-[#C28F8F]">• Atualizada {getTimeAgo()}</span>
        )}
      </div>
    </div>
  );
};

export default LiveStatusFooter;
