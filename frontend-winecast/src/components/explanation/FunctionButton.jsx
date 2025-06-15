const FunctionButton = ({ explanation, onClick, isSelected }) => {
    // Função que trata o clique no botão e envia o ID da explicação
  const handleClick = (event) => {
    onClick(explanation.id, event);
  };

  return (
      // Container do botão, com estilos diferentes se estiver selecionado
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${isSelected ? "border-2 border-[#C28F8F]" : "border border-[#D8D8D8]"}`}>
        {/* Botão principal com título e descrição */}
      <button
        onClick={handleClick}
        className={`w-full text-left p-6 rounded-t-xl transition-all duration-200 ${
          isSelected ? "bg-gradient-to-r from-[#F5E1DA] to-[#E8D0A9]" : "hover:bg-[#F5E1DA]/30"
        }`}
      >
        {/* Título da explicação*/}
        <h3 className="text-lg font-semibold text-[#5A2C2C] mb-2">
          {explanation.title}
        </h3>
        
        {/* Descrição da explicação */}
        <p className="text-[#5A2C2C]/90 text-sm leading-relaxed">
          {explanation.description}
        </p>
      </button>

      {/* Conteúdo expandido quando o botão está selecionado */}
      {isSelected && (
        <div className="px-6 pb-6 space-y-4 bg-gradient-to-r from-[#F5E1DA] to-[#E8D0A9] rounded-b-xl border-t border-[#C28F8F] pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna 1: Objetivo e importância */}
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-[#5A2C2C]">Objetivo:</span>
                <ul className="text-sm text-[#5A2C2C]/90 mt-1 pl-5 list-disc">
                  {explanation.details.purpose.split('\n').map((item, i) => (
                    <li key={i}>{item.replace(/^- /, '').trim()}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-sm font-medium text-[#5A2C2C]">Importância:</span>
                <p className="text-sm text-[#5A2C2C]/90 mt-1">
                  {explanation.details.importance}
                </p>
              </div>
            </div>
             {/* Coluna 2: Uso e parâmetros */}
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-[#5A2C2C]">Uso:</span>
                <p className="text-sm text-[#5A2C2C]/90 mt-1">
                  {explanation.details.usage}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-[#5A2C2C]">Parâmetros:</span>
                <ul className="text-sm text-[#5A2C2C]/90 mt-1 space-y-1">
                  {explanation.details.parameters.map((param, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-[#A3B899] rounded-full mt-1.5 mr-2"></span>
                      {param}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunctionButton;