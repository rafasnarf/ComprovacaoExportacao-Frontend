import React, { useState } from 'react';
import {
  Dialog,
  Button,
  DialogContent,
  DialogTitle,
  DialogActions,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  makeStyles,
  createStyles,
  Theme,
  FormControlProps,
} from '@material-ui/core';

import { format } from 'date-fns';
import { Alert } from '@material-ui/lab';

import useStyles from './styles';

type Error = {
  message: string;
  isError: boolean;
};

interface formData {
  searchType: string;
  value?: number | string;
  dtInicial?: string;
  dtFinal?: string;
}

type SearchModalProps = {
  onSubmit: (value: formData) => void;
  show: boolean;
  onClose: () => void;
};

export function SearchModal({ onSubmit, show, onClose }: SearchModalProps) {
  const classes = useStyles();

  const today = format(new Date(), 'yyyy-MM-dd');

  const [dateSelector, setDateSelector] = useState(false);
  const [centroSelector, setCentroSelector] = useState(false);
  const [mciSelector, setMciSelector] = useState(false);
  const [cnpjSelector, setCnpjSelector] = useState(false);
  const [operationSelector, setOperationSelector] = useState(false);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [mci, setMci] = useState('');
  const [centro, setCentro] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [operation, setOpertaion] = useState('');
  const [error, setError] = useState<Error>({ message: '', isError: false });

  function handleSubmit(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (dateSelector) {
      if (dataInicial === '' || dataFinal === null) {
        setError({ message: 'Preencha as datas para pesquisa', isError: true });
        return;
      } else {
        onSubmit({
          searchType: 'date',
          dtInicial: dataInicial,
          dtFinal: dataFinal,
        });
        onClose();
        return;
      }
    } else if (centroSelector) {
      const numberCentro = Number(centro);
      if (centro.trim() === '') {
        setError({ message: 'Preencha com o número do centro', isError: true });
        return;
      } else if (isNaN(numberCentro)) {
        setError({
          message: 'Preencha apenas com números',
          isError: true,
        });
        return;
      } else {
        onSubmit({ searchType: 'centro', value: centro });
        onClose();
        return;
      }
    } else if (mciSelector) {
      const numberMCI = Number(mci);
      if (mci.trim() === '') {
        setError({
          message: 'Preencha com o código do MCI do cliente',
          isError: true,
        });
        return;
      } else if (isNaN(numberMCI)) {
        setError({
          message: 'Preencha apenas com números',
          isError: true,
        });
        return;
      } else {
        onSubmit({ searchType: 'mci', value: mci });
        onClose();
        return;
      }
    } else if (cnpjSelector) {
      const cnpjNumber = Number(cnpj);
      if (cnpj.trim() === '') {
        setError({ message: 'Preencha com o CNPJ do cliente', isError: true });
        return;
      } else if (isNaN(cnpjNumber)) {
        setError({
          message: 'Preencha apenas com números',
          isError: true,
        });
        return;
      } else {
        onSubmit({ searchType: 'cnpj', value: cnpj });
        onClose();
        return;
      }
    } else if (operationSelector) {
      const operNumber = Number(operation);
      if (operation.trim() === '') {
        setError({
          message: 'Preencha com o número da operação',
          isError: true,
        });
        return;
      } else if (isNaN(operNumber)) {
        setError({ message: 'Preencha apenas com números', isError: true });
        return;
      } else {
        onSubmit({ searchType: 'operation', value: operNumber });
        onClose();
        return;
      }
    } else if (
      !cnpjSelector &&
      !dateSelector &&
      !centroSelector &&
      !mciSelector &&
      !operationSelector
    ) {
      setError({ message: 'Preencha os dados para a pesquisa', isError: true });
      return;
    }
  }

  function handleChanges(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    const value = event.target.value;
    const id = event.target.id;

    switch (id) {
      case 'dtInicial':
        setDataInicial(value);
        break;
      case 'dtFinal':
        setDataFinal(value);
        break;
      case 'centro':
        setCentro(value);
        break;
      case 'mci':
        setMci(value);
        break;
      case 'cnpj':
        setCnpj(value);
        break;
      case 'operation':
        setOpertaion(value);
        break;
      default:
        break;
    }
  }

  function handleSelectors(
    e: React.ChangeEvent<FormControlProps>,
    checked: boolean,
  ) {
    const selector = e.target.defaultValue;

    switch (selector) {
      case 'date':
        if (checked) {
          setDateSelector(checked);
          setCentroSelector(!checked);
          setMciSelector(!checked);
          setCnpjSelector(!checked);
          setOperationSelector(!checked);
        } else {
          setDateSelector(checked);
        }

        break;
      case 'centro':
        if (checked) {
          setDateSelector(!checked);
          setCentroSelector(checked);
          setMciSelector(!checked);
          setCnpjSelector(!checked);
          setOperationSelector(!checked);
        } else {
          setCentroSelector(checked);
        }
        break;
      case 'mci':
        if (checked) {
          setDateSelector(!checked);
          setCentroSelector(!checked);
          setMciSelector(checked);
          setCnpjSelector(!checked);
          setOperationSelector(!checked);
        } else {
          setMciSelector(checked);
        }
        break;
      case 'cnpj':
        if (checked) {
          setDateSelector(!checked);
          setCentroSelector(!checked);
          setMciSelector(!checked);
          setCnpjSelector(checked);
          setOperationSelector(!checked);
        } else {
          setCnpjSelector(checked);
        }
        break;
      case 'operation':
        if (checked) {
          setDateSelector(!checked);
          setCentroSelector(!checked);
          setMciSelector(!checked);
          setCnpjSelector(!checked);
          setOperationSelector(checked);
        } else {
          setOperationSelector(checked);
        }
      default:
        break;
    }
  }

  return (
    <div>
      <Dialog open={show}>
        {error.isError ? (
          <>
            <Alert
              severity="error"
              onClose={() => {
                setError({ message: '', isError: false });
              }}
            >
              {error.message}
            </Alert>
          </>
        ) : (
          ''
        )}
        <DialogTitle>Pesquisa de operações</DialogTitle>
        <DialogContent>
          <form>
            <FormControl className={classes.container}>
              <div>
                <FormControlLabel
                  value="date"
                  control={<Switch color="primary" />}
                  label="Data:"
                  labelPlacement="end"
                  checked={dateSelector}
                  onChange={(event, checked) => handleSelectors(event, checked)}
                />
                <TextField
                  id="dtInicial"
                  label="Data Inicial"
                  type="date"
                  size="small"
                  disabled={!dateSelector ? true : false}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={dataInicial}
                  onChange={event => {
                    handleChanges(event);
                  }}
                  InputProps={{ inputProps: { max: today } }}
                />
                <TextField
                  id="dtFinal"
                  label="Data Final"
                  type="date"
                  size="small"
                  disabled={!dateSelector ? true : false}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={dataFinal}
                  onChange={event => {
                    handleChanges(event);
                  }}
                  InputProps={{ inputProps: { max: today } }}
                />
              </div>
              <div>
                <FormControlLabel
                  value="centro"
                  control={<Switch color="primary" />}
                  label="Centro:"
                  labelPlacement="end"
                  checked={centroSelector}
                  onChange={(event, checked) => handleSelectors(event, checked)}
                />
                <TextField
                  id="centro"
                  label="Centro"
                  variant="outlined"
                  type="text"
                  size="small"
                  disabled={!centroSelector ? true : false}
                  className={classes.textField}
                  value={centro}
                  focused={centroSelector ? true : false}
                  error={centro.length > 4 ? true : false}
                  onChange={event => {
                    handleChanges(event);
                  }}
                  inputProps={{
                    maxLength: 4,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                />
              </div>
              <div>
                <FormControlLabel
                  value="mci"
                  control={<Switch color="primary" />}
                  label="MCI:"
                  labelPlacement="end"
                  checked={mciSelector}
                  onChange={(event, checked) => handleSelectors(event, checked)}
                />
                <TextField
                  id="mci"
                  label="MCI"
                  variant="outlined"
                  type="text"
                  size="small"
                  disabled={!mciSelector ? true : false}
                  focused={mciSelector ? true : false}
                  className={classes.textField}
                  value={mci}
                  onChange={event => {
                    handleChanges(event);
                  }}
                />
              </div>
              <div>
                <FormControlLabel
                  value="cnpj"
                  control={<Switch color="primary" />}
                  label="CNPJ:"
                  labelPlacement="end"
                  checked={cnpjSelector}
                  onChange={(event, checked) => handleSelectors(event, checked)}
                />

                <TextField
                  id="cnpj"
                  label="CNPJ"
                  variant="outlined"
                  type="text"
                  size="small"
                  disabled={!cnpjSelector ? true : false}
                  focused={cnpjSelector ? true : false}
                  error={cnpj.length > 14 ? true : false}
                  className={classes.textField}
                  value={cnpj}
                  // helperText={cnpjSelector ? 'Apenas os números' : false}
                  onChange={event => {
                    handleChanges(event);
                  }}
                  inputProps={{ maxLength: 14 }}
                />
              </div>
              <div>
                <FormControlLabel
                  value="operation"
                  control={<Switch color="primary" />}
                  label="Operação:"
                  labelPlacement="end"
                  checked={operationSelector}
                  onChange={(event, checked) => handleSelectors(event, checked)}
                />
                <TextField
                  id="operation"
                  label="Operação"
                  variant="outlined"
                  type="text"
                  size="small"
                  disabled={!operationSelector ? true : false}
                  focused={operationSelector ? true : false}
                  className={classes.textField}
                  value={operation}
                  onChange={event => {
                    handleChanges(event);
                  }}
                />
              </div>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="secondary">
            Fechar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={event => handleSubmit(event)}
          >
            Pesquisar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
