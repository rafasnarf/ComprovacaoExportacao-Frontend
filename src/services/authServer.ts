import axios from 'axios';
import * as https from 'https';

export const authServer = axios.create({
  baseURL: 'https://pxl0hosp0577.dispositivos.bb.com.br/',
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6',
  },
});

authServer.interceptors.response.use(undefined, error => {
  if (error) {
    if (error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const href = encodeURIComponent(window.location.href);
        window.location.assign(
          'https://login.intranet.bb.com.br/sso/XUI/?goto=' + href,
        );
        // window.location.assign("https://login.intranet.bb.com.br/distAuth/UI/Login?goto="+href)
      }
    }
    return Promise.reject(error);
  }
});
