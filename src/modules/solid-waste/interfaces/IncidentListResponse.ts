import { ApiPaginationResponse } from '@/interfaces/ApiResponse';

export type IncidentListResponse = ApiPaginationResponse<
  {
    id: number;
    nombre: string;
    descripcion: string;
    tiempo_respuesta: string;
    mensaje: string;
    created_at: string;
    updated_at: string;
  }[]
>;
