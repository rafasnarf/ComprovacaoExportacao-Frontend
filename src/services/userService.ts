import { authServer } from './authServer';

const userServices = {
  getUser(cookies: any) {
    return authServer.get('auth/', {
      headers: {
        Cookie: `BBSSOToken=${cookies.BBSSOToken}`,
      },
    });
  },
};

export default userServices;
