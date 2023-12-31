import pkg from "pg";

const { Pool } = pkg;
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "32387925",
  database: "likeme",
  port: 5432,
  allowExitOnIdle: true,
});

export const getPosts = async () => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts");
    return rows;
  } catch (error) {
    throw new Error("Error interno del servidor al obtener posts");
  }
};

export const addPost = async (titulo, img, descripcion) => {
  try {
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, img, descripcion, 0]
    );

    const nuevoPost = result.rows[0];
    nuevoPost.likes = nuevoPost.likes || 0;

    return nuevoPost;
  } catch (error) {
    throw new Error("Error interno del servidor al agregar post");
  }
};

export const updatePost = async (postId, titulo, img, descripcion) => {
  try {
    const result = await pool.query(
      "UPDATE posts SET titulo = $1, img = $2, descripcion = $3 WHERE id = $4 RETURNING *",
      [titulo, img, descripcion, postId]
    );

    return result.rows.length === 0 ? null : result.rows[0];
  } catch (error) {
    throw new Error("Error interno del servidor al modificar post");
  }
};

export const deletePost = async (postId) => {
  try {
    const result = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [postId]);

    return result.rows.length === 0 ? null : result.rows[0];
  } catch (error) {
    throw new Error("Error interno del servidor al eliminar post");
  }
};
