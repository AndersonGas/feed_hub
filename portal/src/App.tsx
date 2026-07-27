function App() {

  async function sincronizarDados() {
    try {
      // Buscar usuários
      const respostaUsuarios = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );

      const usuarios = await respostaUsuarios.json();


      // Transformar usuários para o formato do banco
      const usuariosParaBanco = usuarios.map((usuario: any) => ({
        id: usuario.id,
        nome: usuario.name,
        apelido: usuario.username,
        empresa: usuario.company.name
      }));


      console.log("Usuários para o banco:", usuariosParaBanco);



      // Buscar posts
      const respostaPosts = await fetch(
        'https://jsonplaceholder.typicode.com/posts'
      );

      const posts = await respostaPosts.json();


      // Transformar posts para o formato do banco
      const postsParaBanco = posts.map((post: any) => ({
        id: post.id,
        titulo: post.title,
        texto: post.body,
        id_usuario: post.userId
      }));


      console.log("Posts para o banco:", postsParaBanco);


    } catch (erro) {
      console.log("Erro na sincronização:", erro);
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
