import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';

export function useApiWithAuth() {
  const api = useApi();
  const auth = useAuth();

  const handleApiCall = async <T,>(
    apiCall: () => Promise<T>,
    successMessage?: string
  ): Promise<T | null> => {
    api.startLoading();
    api.setError(null);

    try {
      const result = await apiCall();
      if (successMessage) {
        api.addNotification('success', successMessage);
      }
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Ha ocurrido un error';
      api.setError(errorMessage);
      api.addNotification('error', errorMessage);

      // Si el error es de autenticación (401), hacer logout
      if (error.status === 401) {
        auth.logout();
      }
      return null;
    } finally {
      api.stopLoading();
    }
  };

  return { handleApiCall, ...api, ...auth };
}