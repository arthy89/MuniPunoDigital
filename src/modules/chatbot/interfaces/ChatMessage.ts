export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  imageUrl?: string;       // Opcional: para mensajes con imágenes
  quickReplies?: string[]; // Opcional: sugerencias rápidas contextuales
  error?: boolean;         // Opcional: para marcar errores de envío
}