import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

interface Post {
  id: number;
  titulo: string;
  texto: string;
  usuarios: {
    nome: string;
  }[];
}

function App() {
  const [mensagem, setMensagem] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [busca, setBusca] = useState("");

  async function carregarPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        titulo,
        texto,
        usuarios (
          nome
        )
      `);

    if (error) {
      console.error(error);
      return;
    }

    setPosts(data as Post[]);
  }

  async function sincronizarDados() {
    try {
      setMensagem("Sincronizando dados...");

      // ==========================
      // BUSCAR USUÁRIOS
      // ==========================

      const respostaUsuarios = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      const usuarios = await respostaUsuarios.json();

      const usuariosParaBanco = usuarios.map((usuario: any) => ({
        id: usuario.id,
        nome: usuario.name,
        apelido: usuario.username,
        empresa: usuario.company.name,
      }));

      // ==========================
      // BUSCAR POSTS
      // ==========================

      const respostaPosts = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      const posts = await respostaPosts.json();

      const postsParaBanco = posts.map((post: any) => ({
        id: post.id,
        titulo: post.title,
        texto: post.body,
        id_usuario: post.userId,
      }));

      // ==========================
      // LIMPAR TABELAS
      // ==========================

      await supabase.from("posts").delete().neq("id", 0);
      await supabase.from("usuarios").delete().neq("id", 0);

      // ==========================
      // INSERIR DADOS
      // ==========================

      const { error: erroUsuarios } = await supabase
        .from("usuarios")
        .insert(usuariosParaBanco);

      if (erroUsuarios) throw erroUsuarios;

      const { error: erroPosts } = await supabase
        .from("posts")
        .insert(postsParaBanco);

      if (erroPosts) throw erroPosts;

      setMensagem("Dados sincronizados com sucesso!");

      await carregarPosts();
    } catch (erro) {
      console.error(erro);
      setMensagem("Erro ao sincronizar dados");
    }
  }

  useEffect(() => {
    carregarPosts();
  }, []);

  const postsFiltrados = posts.filter((post) =>
    post.usuarios[0]?.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1>Portal de Dados</h1>

      <button onClick={sincronizarDados}>
        Sincronizar Dados
      </button>

      <p>{mensagem}</p>

      <input
        type="text"
        placeholder="Buscar por autor..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      {postsFiltrados.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          <h2>{post.titulo}</h2>

          <strong>Autor:</strong> {post.usuarios[0]?.nome}

          <p>{post.texto}</p>
        </div>
      ))}
    </div>
  );
}

export default App;