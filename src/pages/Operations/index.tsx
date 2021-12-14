import React, { useContext, useState } from 'react';

import { DataHook } from '../../hooks/dataHook';

import { Header } from '../../components/Header';
import { SearchModal } from '../../components/SearchModal';
import { ErrorModal } from '../../components/ErrorModal';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { DataTable } from '../../components/DataTable';

import './styles.css';
import { Operation } from '../../dtos/OperationsDTO';
import { DueDTO } from '../../dtos/DueDTO';
import { ManualConfirmationDTO } from '../../dtos/ManualConfirmationsDTO';
import { UserContext } from '../../context/UserContext';
import { Redirect } from 'react-router-dom';

export function Operations() {
  const {
    confirmations,
    operations,
    setSearchData,
    messageError,
    showError,
    setShowError,
    rowSelected,
    setRowSelected,
    showConfirmation,
    setShowConfirmation,
  } = DataHook();
  const [show, setShow] = useState(true);
  const [dues, setDues] = useState<DueDTO[]>([]);
  const [confirmation, setConfirmation] = useState<ManualConfirmationDTO>();
  const { login } = useContext(UserContext);

  function handleOperations() {
    if (!showError) {
      return (
        <DataTable
          operations={operations}
          onOpenSearch={() => setShow(true)}
          // confirmations={confirmations}
          onClickRow={(
            operation: Operation,
            dues: DueDTO[],
            confirmation: ManualConfirmationDTO | undefined,
          ) => {
            setDues(dues);
            setConfirmation(confirmation);
            setRowSelected(operation);
            setShowConfirmation(true);
          }}
        />
      );
    } else {
      return (
        <ErrorModal
          onClose={() => setShowError(false)}
          showError={showError}
          messageError={messageError}
        />
      );
    }
  }

  function handleSearchModal() {
    if (show) {
      return (
        <SearchModal
          onSubmit={setSearchData}
          show={show}
          onClose={() => setShow(false)}
        />
      );
    }
  }

  function handleShowConfirmation() {
    if (showConfirmation) {
      return (
        <ConfirmationModal
          show={showConfirmation}
          operation={rowSelected}
          confirmation={confirmation}
          dues={dues}
          onClose={() => setShowConfirmation(false)}
        />
      );
    }
  }

  return (
    <div id="page-operations">
      {!login && <Redirect to="/" />}
      <Header />
      {handleOperations()}
      {handleShowConfirmation()}
      {handleSearchModal()}
    </div>
  );
}
