import tupaApi from '@/api/tupaApi';

export const getTupaProcedure = async (id: string) => {
  const response = await tupaApi.get(`/sgd/tupas/${id}`);
  console.log('response', response);
  return response.data;
};
