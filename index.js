import express from "express";
import cors from "cors";
import { getPosts, addPost, updatePost, deletePost } from "./consultas.js";

const app = express();
const PORT = 3001;

app.use(express.json());

// Configuración de CORS
app.use(express.json());
app.use(cors());


// CRUD

// Ruta GET (Read)
app.get("/posts", async (req, res) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (error) {
    console.error("Error al obtener los posts:", error.message);
    res.status(500).json({ error: "Error interno del servidor al obtener posts" });
  }
});

// Ruta POST (Create)
app.post("/posts", async (req, res) => {
  try {
    const { titulo, img, descripcion, ...otrosDatos } = req.body;

    // Verificar que no hay otras propiedades 
    if (Object.keys(otrosDatos).length > 0) {
      return res.status(400).json({ error: "Solamente son permitidos los datos relativos a titulo, imagen y descripcion." });
    }

    if (!titulo || !img || !descripcion) {
      return res.status(400).json({ error: "Titulo, imagen y descripción son campos requeridos." });
    }

    // Verificacion de repeticion de título, imagen o descripción
    const posts = await getPosts();

    const postExistente = posts.find(post => post.titulo === titulo || post.img === img || post.descripcion === descripcion);

    if (postExistente) {
      return res.status(400).json({ error: "Ya existe un post con el mismo título, imagen o descripción." });
    }

    const nuevoPost = await addPost(titulo, img, descripcion);
    
    res.status(201).json({ message: "Post agregado con éxito", nuevoPost });
  } catch (error) {
    console.error("Error al agregar el post:", error.message);
    res.status(500).json({ error: "Error interno del servidor al agregar post" });
  }
});



// Ruta PUT (Update)
app.put("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { titulo, img, descripcion } = req.body;

    if (!titulo || !img || !descripcion) {
      return res.status(400).json({ error: "Titulo, imagen y descripción son campos requeridos." });
    }

    const postModificado = await updatePost(postId, titulo, img, descripcion);

    if (!postModificado) {
      return res.status(404).json({ error: "No se encontró el post a modificar." });
    }

    res.json({ message: "Post modificado con éxito", postModificado });
  } catch (error) {
    console.error("Error al modificar el post:", error.message);
    res.status(500).json({ error: "Error interno del servidor al modificar post" });
  }
});

// Ruta DELETE (Delete)
app.delete("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const postEliminado = await deletePost(postId);

    if (!postEliminado) {
      return res.status(404).json({ error: "No se encontró el post a eliminar." });
    }

    res.json({ message: "Post eliminado con éxito", postEliminado });
  } catch (error) {
    console.error("Error al eliminar el post:", error.message);
    res.status(500).json({ error: "Error interno del servidor al eliminar post" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor conectado en el puerto ${PORT}`);
});
