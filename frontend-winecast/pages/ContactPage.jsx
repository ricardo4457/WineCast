import { useState } from "react";

// Componente da página de contacto
const ContactPage = () => {
  // Estado para armazenar os dados do formulário (nome, email, mensagem)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Atualiza o estado do formulário à medida que o utilizador escreve
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Envia o formulário e limpa os campos
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Secção "Quem Somos" */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-[#8B5E3C] text-center">
            Quem Somos
          </h2>
          <p className="text-lg text-[#543826] text-center max-w-3xl mx-auto">
            Três estudantes do ISTEC, apaixonados por tecnologia e vinhos,
            uniram forças para criar uma plataforma inovadora com conhecimento
            vitivinícola. O nosso objetivo é ajudar os viticultores a otimizar a
            produção de vinho, oferecendo análises precisas e recomendações
            personalizadas para cada vinha.
          </p>
        </section>

        {/* Secção "Contactos" com informações de cada membro */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-[#8B5E3C] text-center">
            Contactos
          </h2>
          {/* Cartão do Nuno */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-[#5A2C2C]">
                Nuno Camacho
              </h3>
              <p className="text-[#543826]">nuno.camacho.2022276@my.istec.pt</p>
              <p className="text-[#543826]">+351 941 231 891</p>
            </div>
            {/* Cartão do Ivo */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-[#5A2C2C]">
                Ivo Oliveira
              </h3>
              <p className="text-[#543826]">ivo.oliveira.2022267@my.istec.pt</p>
              <p className="text-[#543826]">+351 954 483 594</p>
            </div>
            {/* Cartão do Ricardo */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-[#5A2C2C]">
                Ricardo Vieira
              </h3>
              <p className="text-[#543826]">ricardo.vieira.50073@my.istec.pt</p>
              <p className="text-[#543826]">+351 972 431 653</p>
            </div>
          </div>
        </section>

        {/* Secção "Fale Connosco" com formulário de contacto */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-[#8B5E3C] text-center">
            Fale Connosco
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto space-y-4"
          >
            {/* Campo Nome */}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#5A2C2C]"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-[#E8D0A9] rounded-md shadow-sm p-2"
              />
            </div>

            {/* Campo Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#5A2C2C]"
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-[#E8D0A9] rounded-md shadow-sm p-2"
              />
            </div>
            {/* Campo Mensagem */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#5A2C2C]"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="mt-1 block w-full border border-[#E8D0A9] rounded-md shadow-sm p-2"
              ></textarea>
            </div>
           {/* Botão de envio */}
            <button
              type="submit"
              className="w-full bg-[#8B5E3C] text-white py-2 rounded-md shadow-md hover:bg-[#6F4B30] transition"
            >
              Enviar Mensagem
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
