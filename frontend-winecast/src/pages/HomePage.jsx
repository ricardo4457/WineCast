// Importa componentes reutilizáveis
import FunctionButtonList from "../components/explanation/FunctionButtonList.jsx";
import RegionButtonList from "../components/region/RegionButtonList.jsx";
import ImageBanner from "../components/banners/ImageBanner.jsx";

// Página inicial do site
export default function HomePage() {
  
   const imageSources = [
    '/assets/alentejo/alentejo_1.png',
    '/assets/douro/douro_1.jpg',
     '/assets/minho/minho_1.jpg',
    ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner com imagens no topo */}
      <section className="w-full">
        <ImageBanner imageSources={imageSources} />
      </section>

      {/* Conteúdo principal da página */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Secção das Regiões */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-[#8B5E3C] tracking-tight">
              Regiões Vinícolas
            </h2>
            <p className="text-[#543826] text-lg max-w-2xl mx-auto">
              Explore as principais regiões vinícolas e suas características
            </p>
          </div>
          {/* Lista de botões com as regiões */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <RegionButtonList />
          </div>
        </section>

        {/* Secção com as funcionalidades inteligentes */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-[#8B5E3C] tracking-tight">
              Recursos Inteligentes
            </h2>
            <p className="text-[#543826] text-lg max-w-2xl mx-auto">
              Descubra ferramentas avançadas para aumentar a eficácia na gestão
              da sua vinha
            </p>
          </div>
          {/* Lista de botões com explicações das funções */}
          <FunctionButtonList />
        </section>
      </div>
    </div>
  );
}
