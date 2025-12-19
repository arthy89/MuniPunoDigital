import tupaApi from '@/api/tupaApi';
import { FilterApi } from '@/interfaces/FilterApiTypes';

export const getPhoneList = async ({ page, limit, search }: FilterApi) => {
  const response = await tupaApi.get(`/directorio`, {
    params: { page, rowsPerPage: limit, search },
    headers: { noLoader: true },
  });
  return response.data.data;
};
