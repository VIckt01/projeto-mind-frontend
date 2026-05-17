import { api } from "../api";

// Interfaces para tipar as entradas e saídas no Frontend
export interface ICommentAuthor {
  id: string;
  name: string;
  profileImg: string | null;
}

export interface IComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  articleId: string;
  author: ICommentAuthor;
}

interface CreateCommentParams {
  content: string;
  articleId: string;
}

interface UpdateCommentParams {
  id: string;
  content: string;
}

export const commentClientService = {
  // 1. ENVIAR UM NOVO COMENTÁRIO
  async create({ content, articleId }: CreateCommentParams): Promise<IComment> {
    const response = await api.post(`/comment/article/${articleId}`, { content });
    // O backend retorna { message: "...", comment: {...} }
    return response.data.comment;
  },

  // 2. ATUALIZAR UM COMENTÁRIO EXISTENTE
  async update({ id, content }: UpdateCommentParams): Promise<IComment> {
    const response = await api.put(`/comment/${id}`, { content });
    return response.data.comment;
  },

  // 3. EXCLUIR UM COMENTÁRIO
  async delete(id: string): Promise<void> {
    await api.delete(`/comment/${id}`);
  }
};