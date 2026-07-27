import { useState } from 'react';
function App() {
  const [dadosCarregados, setDadosCarregados] = useState(false);

  function carregarDados() {
    console.log("Sincronização iniciada");

    // Futuramente:
    // 1. Buscar usuários da API
    // 2. Buscar posts da API
    // 3. Salvar no Supabase

    setDadosCarregados(true);
  }

  return (
    <div>
      <h1>Portal de Dados</h1>

      <button onClick={carregarDados}>
        Sincronizar Dados
      </button>

      {dadosCarregados && (
        <p>Dados carregados com sucesso!</p>
      )}
    </div>
  );
}

export default App;
