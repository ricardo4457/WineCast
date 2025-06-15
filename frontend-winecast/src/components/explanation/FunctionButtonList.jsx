import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedFunction } from "../../stores/explanationsStore";
import FunctionButton from "./FunctionButton";

const FunctionButtonList = () => {
  const dispatch = useDispatch();

  // Vai buscar as explicações das funções ao estado global (Redux)
  const functions = useSelector(
    (state) => state.explanations.functionExplanations
  );
  // Estado local para controlar qual botão está aberto/selecionado
  const [openId, setOpenId] = useState(null);

  // Quando se clica num botão, atualiza o estado global e alterna o botão aberto
  const handleSelect = (id) => {
    dispatch(setSelectedFunction(id));
    setOpenId(openId === id ? null : id); // Fecha se já estiver aberto
  };

  return (
    // Grelha de botões (1 coluna no telemóvel, 2 no desktop)
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {functions.map((func) => (
        <FunctionButton
          key={func.id}
          explanation={func} // Dados da explicação
          onClick={handleSelect} // Função de clique
          isSelected={openId === func.id} // Verifica se está selecionado
        />
      ))}
    </div>
  );
};

export default FunctionButtonList;
