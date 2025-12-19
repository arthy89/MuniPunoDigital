import muniApi from '@/api/muniApi';
import { IncidentListResponse } from '../interfaces/IncidentListResponse';
import { SelectData } from '@/interfaces/SelectTypes';
import { sleep } from '@/utils/sleep';

export const getIncidentList = async (): Promise<SelectData[]> => {
  const { data: response } = await muniApi.get<IncidentListResponse>(
    '/catalogos',
  );
  return response.data.map(incident => ({
    label: incident.nombre,
    value: incident.id.toString(),
  }));
};
