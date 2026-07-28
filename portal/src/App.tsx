import { useState } from 'react';
import { supabase } from './lib/supabase';

function App() {

  const [mensagem, setMensagem] = useState('');

  async function sincronizarDados() {

    try {

      setMensagem('Sincronizando dados...');


      // ==========================
      // BUSCAR USUÁRIOS DA API
      // ==========================

      const respostaUsuarios = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );

      const usuarios = await respostaUsuarios.json();


      // Transformar usuários para o banco

      const usuariosParaBanco = usuarios.map((usuario: any) => ({
        id: usuario.id,
        nome: usuario.name,
        apelido: usuario.username,
        empresa: usuario.company.name
      }));



      // ==========================
      // BUSCAR POSTS DA API
      // ==========================

      const respostaPosts = await fetch(
        'https://jsonplaceholder.typicode.com/posts'
      );

      const posts = await respostaPosts.json();


      // Transformar posts para o banco

      const postsParaBanco = posts.map((post: any) => ({
        id: post.id,
        titulo: post.title,
        texto: post.body,
        id_usuario: post.userId
      }));



      console.log("Usuários:", usuariosParaBanco);
      console.log("Posts:", postsParaBanco);



      // ==========================
      // LIMPAR POSTS ANTIGOS
      // ==========================

      const { error: erroDeletePosts } = await supabase
        .from('posts')
        .delete()
        .neq('id', 0);


      if (erroDeletePosts) {
        throw erroDeletePosts;
      }



      // ==========================
      // LIMPAR USUÁRIOS ANTIGOS
      // ==========================

      const { error: erroDeleteUsuarios } = await supabase
        .from('usuarios')
        .delete()
        .neq('id', 0);


      if (erroDeleteUsuarios) {
        throw erroDeleteUsuarios;
      }



      // ==========================
      // INSERIR USUÁRIOS
      // ==========================

      const { error: erroInsertUsuarios } = await supabase
        .from('usuarios')
        .insert(usuariosParaBanco);


      if (erroInsertUsuarios) {
        throw erroInsertUsuarios;
      }



      // ==========================
      // INSERIR POSTS
      // ==========================

      const { error: erroInsertPosts } = await supabase
        .from('posts')
        .insert(postsParaBanco);


      if (erroInsertPosts) {
        throw erroInsertPosts;
      }



      setMensagem('Dados sincronizados com sucesso!');

      console.log('Sincronização concluída!');


    } catch (erro) {

      console.log('Erro na sincronização:', erro);

      setMensagem('Erro ao sincronizar dados');

    }

  }



  return (
    <div>

      <h1>Portal de Dados</h1>


      <button onClick={sincronizarDados}>
        Sincronizar Dados
      </button>


      <p>{mensagem}</p>


    </div>
  );
}


export default App;
