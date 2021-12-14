import { authServer } from '../services/authServer';
import useSWR from 'swr';

export default function userData() {
  const fetcher = (url: any) => authServer.get(url).then(res => res.data);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, mutate, error } = useSWR(
    'https://pxl0hosp0577.dispositivos.bb.com.br/auth/',
    fetcher,
  );

  const loading = !data && !error;
  const loggedOut = error && error.status === 401;

  return {
    loading,
    loggedOut,
    user: data,
    mutate,
  };
}
