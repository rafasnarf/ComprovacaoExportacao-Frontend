import { useState, useEffect } from 'react';

import { Operation } from '../dtos/OperationsDTO';
import { ManualConfirmationDTO } from '../dtos/ManualConfirmationsDTO';

import { api } from '../services/api';
import { AxiosResponse } from 'axios';

interface formData {
  searchType: string;
  value?: number | string;
  dtInicial?: string;
  dtFinal?: string;
}

export function DataHook(data?: formData) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [confirmations, setConfirmations] = useState<ManualConfirmationDTO[]>(
    [],
  );
  const [searchData, setSearchData] = useState<formData>();
  const [messageError, setMessageError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [rowSelected, setRowSelected] = useState<Operation>({
    cenop: 0,
    cnpjCli: 0,
    mci: 0,
    vlrOper: 0,
    prefDepe: 0,
    nrOper: 0,
    situacao: '',
    nomeCli: '',
    dtFormalizacao: '',
    dtFinal: '',
  });

  async function getAllConfirmations(): Promise<void> {
    const response = await api.get('/manualconfirmation');

    const confirmation = await response.data;
    setConfirmations(confirmation);
  }

  async function handleOperations(): Promise<void> {
    const searchType = searchData?.searchType;

    let response;
    switch (searchType) {
      case 'date':
        response = await api.get('/operations/date', {
          params: {
            startDate: searchData?.dtInicial,
            finalDate: searchData?.dtFinal,
          },
        });
        handleResponse(response);
        break;
      case 'centro':
        response = await api.get('/operations/cenop', {
          params: {
            prefixoCenop: Number(searchData?.value),
          },
        });
        handleResponse(response);
        break;
      case 'mci':
        response = await api.get('/operations/mci', {
          params: {
            mci: Number(searchData?.value),
          },
        });
        handleResponse(response);
        break;
      case 'cnpj':
        response = await api.get('/operations/cnpj', {
          params: {
            cnpj: Number(searchData?.value),
          },
        });
        handleResponse(response);
        break;
      case 'operation':
        response = await api.get('/operations/nroper', {
          params: {
            nrOper: searchData?.value,
          },
        });
        handleResponse(response);
        break;
      default:
        break;
    }
  }

  function handleResponse(response: AxiosResponse) {
    const operation = response.data;

    if (operation.hasOwnProperty('message')) {
      setMessageError(operation.message);
      setShowError(true);
      setOperations([]);
    } else {
      setMessageError('');
      setShowError(false);
      if (!Array.isArray(operation)) {
        const singleOperation = [];
        singleOperation.push(operation);
        setOperations(singleOperation);
      } else {
        setOperations(operation);
      }
    }
  }

  useEffect(() => {
    getAllConfirmations();
    handleOperations();
  }, [searchData]);

  return {
    confirmations,
    operations,
    searchData,
    setSearchData,
    messageError,
    showError,
    setShowError,
    showConfirmation,
    setShowConfirmation,
    rowSelected,
    setRowSelected,
  };
}
