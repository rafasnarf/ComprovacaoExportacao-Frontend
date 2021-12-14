import React, { useContext } from 'react';

import logoDiope from '../../assets/logo_diope.png';
import { UserContext } from '../../context/UserContext';

import './styles.css';

export function Header() {
  const { nome, matricula } = useContext(UserContext);

  return (
    <section>
      <div className="operations-header">
        <img src={logoDiope} alt="logo Diope" />
        <div className="title">
          <p>Controle e Comprovação de Exportação</p>
        </div>
        <div className="login-data">
          <img
            className="profile"
            src={`https://humanograma.intranet.bb.com.br/avatar/${matricula}`}
            alt={`${nome}`}
          />
          <p>Bem vindo {nome}</p>
        </div>
      </div>
    </section>
  );
}
