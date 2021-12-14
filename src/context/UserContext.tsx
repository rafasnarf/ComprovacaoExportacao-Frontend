import React, { createContext, ReactNode, useState } from 'react';

interface UserContextData {
  matricula: string;
  nome: string;
  prefixo: number;
  createSession: (
    matricula: string,
    nome: string,
    prefixo: number,
    login: boolean,
  ) => void;
  login: boolean;
}
export const UserContext = createContext<UserContextData>(
  {} as UserContextData,
);

type UserContextProviderProps = {
  children: ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState(false);
  const [prefixo, setPrefixo] = useState(0);

  function createSession(
    matricula: string,
    nome: string,
    prefixo: number,
    login: boolean,
  ) {
    setMatricula(matricula);
    setNome(nome);
    setPrefixo(prefixo);
    setLogin(login);
  }

  return (
    <UserContext.Provider
      value={{
        matricula,
        nome,
        prefixo,
        createSession,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// export const userInfo = () => useContext(UserContext);
