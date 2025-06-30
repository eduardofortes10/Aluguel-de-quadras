import React from 'react';

const Register = () => {
  return (
    <section className="flex min-h-screen">
      
      {/* LADO ESQUERDO - Imagem com texto */}
      <div
        className="w-2/5 bg-cover bg-center relative hidden lg:block"
        style={{ backgroundImage: "url('/src/assets/logo-fundo.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-white p-6 max-w-md">
            <h2 className="text-3xl font-bold mb-4">QuadraFlex</h2>
            <p>
              Bem-vindo ao QuadraFlex! Aqui você encontra a maneira mais rápida e prática de reservar quadras esportivas perto de você. 
              Seja para jogar futebol, basquete, tênis ou qualquer outra modalidade, nos conectamos você aos melhores espaços com horários flexíveis, preços acessíveis e confirmação imediata.
            </p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO - Formulário */}
      <div className="w-full lg:w-3/5 bg-[#47B560] flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-wider text-white capitalize">
            Crie sua conta agora
          </h1>

          <p className="mt-4 text-gray-100">
            Vamos te deixar pronto para reservar suas quadras e aproveitar ao máximo a plataforma QuadraFlex.
          </p>

          <div className="mt-6">
            <h1 className="text-white">Escolha o tipo de conta</h1>

            <div className="mt-3 md:flex md:items-center md:-mx-2">
              <button className="flex justify-center w-full px-6 py-3 text-white bg-[#1E8449] rounded-lg md:w-auto md:mx-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
                <span className="mx-2">Cliente</span>
              </button>

              <button className="flex justify-center w-full px-6 py-3 mt-4 text-white border border-white rounded-lg md:mt-0 md:w-auto md:mx-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="mx-2">Administrador</span>
              </button>
            </div>
          </div>

          <form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm text-white">Nome</label>
              <input
                type="text"
                placeholder="João"
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">Sobrenome</label>
              <input
                type="text"
                placeholder="Silva"
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">Telefone</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">Email</label>
              <input
                type="email"
                placeholder="joao@email.com"
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">Senha</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">Confirmar Senha</label>
              <input
                type="password"
                placeholder="Repita a senha"
                className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <button
              className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#1E8449] rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50 md:col-span-2"
            >
              <span>Criar conta</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
