function App() {

  async function sincronizarDados() {
    try {
      const respostaUsuarios = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );

      const usuarios = await respostaUsuarios.json();

      console.log("Usuários:", usuarios);


      const respostaPosts = await fetch(
        'https://jsonplaceholder.typicode.com/posts'
      );

      const posts = await respostaPosts.json();

      console.log("Posts:", posts);

    } catch (erro) {
      console.log("Erro ao buscar dados:", erro);
    }
  }


  return (
    <div>
      <h1>Portal de Dados</h1>

      <button onClick={sincronizarDados}>
        Sincronizar Dados
      </button>
    </div>
  );
}

export default App;
