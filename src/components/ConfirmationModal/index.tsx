import React, { useContext, useEffect, useReducer, useState } from 'react';

import {
  Dialog,
  Button,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  FormControl,
  Tooltip,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { Operation } from '../../dtos/OperationsDTO';
import formatValue from '../../utils/formatValue';
import { DueComponent } from '../DueComponent';
import { format, parseISO } from 'date-fns';
import { DueDTO } from '../../dtos/DueDTO';
import { ManualConfirmationDTO } from '../../dtos/ManualConfirmationsDTO';

import { api } from '../../services/api';
import { UserContext } from '../../context/UserContext';

import useStyles from './styles';

type ConfirmationProps = {
  operation: Operation;
  show: boolean;
  onClose: () => void;
  dues: DueDTO[];
  confirmation: ManualConfirmationDTO | undefined;
};

type Error = {
  message: string;
  isError: boolean;
  nrDue?: string;
};

export function ConfirmationModal({
  operation,
  onClose,
  show,
  dues,
  confirmation,
}: ConfirmationProps) {
  const [dueFields, setDueFields] = useState(0);
  const [error, setError] = useState<Error>({ message: '', isError: false });
  const [sucess, setSucess] = useState<Error>({ message: '', isError: false });
  const [totalDues, setTotalDues] = useState(0);
  const [observacoes, setObservacoes] = useState('');
  const [allDues, setAllDues] = useState<DueDTO[]>(dues);
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const [buttons, setButtons] = useState(
    confirmation?.id !== undefined ? true : false,
  );
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorsOnFile, setErrorsOnFile] = useState<Error[]>([]);

  const { matricula } = useContext(UserContext);

  function handleConfirmationButton() {
    if (confirmation !== undefined) {
      if (confirmation.id === undefined) {
        if (totalDues >= operation.vlrOper) {
          return false;
        } else if (totalDues < operation.vlrOper) {
          return true;
        }
      } else {
        return true;
      }
    }
  }

  function handleTotalDues() {
    if (allDues.length !== 0) {
      const duesTotal = dues
        .map(a => Number(a.valorDue))
        .reduce((a, b) => {
          return a + b;
        });
      // if (totalDues > duesTotal) {
      //   return;
      // } else {
      setTotalDues(duesTotal);
      // }
    }
  }

  function handleChangeTotalDues(index: number, due: DueDTO) {
    dues.splice(index, 1, due);
    setTotalDues(totalDues + Number(due.valorDue));
    setAllDues(dues);
    forceUpdate();
  }

  function handleRemoveDues(index: number, due: DueDTO) {
    dues.splice(index, 1);
    setTotalDues(totalDues - Number(due.valorDue));
    setAllDues(dues);
    forceUpdate();
  }

  function handleAddDues() {
    const due = dueFields + 1;
    setDueFields(due);
  }

  function handleFileDialog() {
    setShowFileDialog(!showFileDialog);
  }

  function handleChangeFile(event: React.ChangeEvent<HTMLInputElement.Files>) {
    if (event.target.files !== undefined) {
      if (event.target.files?.length === 0) {
        setError({
          message: 'Erro na inclusão do arquivo',
          isError: true,
        });
        return;
      } else if (event.target.files[0] !== null) {
        setSelectedFile(event.target.files[0]);
      }
    }
  }

  async function handleSubmitFile() {
    const formData = new FormData();
    if (selectedFile !== null) {
      formData.append('duesFile', selectedFile);
      formData.append('operation', operation.nrOper.toString());
      formData.append('cnpjOper', operation.cnpjCli.toString());
    }
    const response = await api.post('/due/uploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const result = response.data;
    handleAddFilesDues(result);

    handleFileDialog();
  }

  function handleAddFilesDues(result: DueDTO[] | Error) {
    for (let i = 0; i < result.length; i += 1) {
      if (result[i].id === undefined) {
        errorsOnFile.push(result[i]);
        // setErrorsOnFile(result[i]);
      } else {
        dues.push(result[i]);
      }
    }
    handleTotalDues();
    handleErrorsOnFile();
    forceUpdate();
  }

  function handleErrorsOnFile() {
    if (errorsOnFile.length > 0) {
      errorsOnFile.map((error, index) => {
        return (
          <>
            <Alert
              key={index}
              severity="error"
              onClose={() => {
                setErrorsOnFile([]);
              }}
            >
              {`A DUE de nº ${error.nrDue} apresentou erro no cadastro, tente incluí-la manualmente se for o caso`}
            </Alert>
          </>
        );
      });
    }
  }

  async function handleSubmit() {
    const data: ManualConfirmationDTO = {
      nrOper: operation.nrOper,
      prefDepe: operation.cenop,
      matriculaConfirmacao: matricula,
      observacoes: observacoes,
    };

    const response = await api.post('/manualconfirmation/save', data);

    if (totalDues < operation.vlrOper) {
      setError({
        message:
          'Valor total de DUEs não cobre a operação, impossível confirmar',
        isError: true,
      });
      return;
    }

    if (response.data.statusCode === 208) {
      setError({
        message: 'Já existe confirmação para essa operação',
        isError: true,
      });
      return;
    } else {
      setSucess({
        message: 'Comprovação manual realizada',
        isError: true,
      });
      setButtons(true);
    }
  }

  function handleAddNewDue(newDue: DueDTO) {
    dues.push(newDue);
    setTotalDues(totalDues + Number(newDue.valorDue));
    setDueFields(dueFields - 1);
    forceUpdate();
  }

  useEffect(() => {
    handleTotalDues();
  }, [totalDues]);

  const classes = useStyles();
  return (
    <>
      <FormControl>
        <div>
          <Dialog open={show} classes={{ paper: classes.paper }}>
            {errorsOnFile.length > 0 &&
              errorsOnFile.map((error, index) => {
                return (
                  <>
                    <Alert
                      key={index}
                      severity="error"
                      onClose={() => {
                        setErrorsOnFile([]);
                      }}
                    >
                      {`A DUE de nº ${error.nrDue} apresentou erro no cadastro, verifique e tente incluí-la manualmente se for o caso`}
                    </Alert>
                  </>
                );
              })}
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
            {sucess.isError ? (
              <>
                <Alert
                  severity="success"
                  onClose={() => {
                    setSucess({ message: '', isError: false });
                  }}
                >
                  {sucess.message}
                </Alert>
              </>
            ) : (
              ''
            )}
            <DialogTitle>Comprovação Manual</DialogTitle>
            <DialogContent className={classes.container}>
              <div>
                <Dialog open={showFileDialog} maxWidth="xs">
                  <DialogTitle>Upload de arquivo CSV</DialogTitle>
                  <DialogContent>
                    <input
                      type="file"
                      id="fileUpload"
                      accept=".csv"
                      onChange={handleChangeFile}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleFileDialog}
                    >
                      Fechar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitFile}
                    >
                      Enviar
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              <div className={classes.area1}>
                <TextField
                  id="mci"
                  label="MCI"
                  variant="filled"
                  type="text"
                  size="small"
                  disabled={true}
                  className={classes.textField}
                  value={operation?.mci}
                />
                <TextField
                  id="cnpj"
                  label="CNPJ"
                  variant="filled"
                  type="text"
                  size="small"
                  disabled={true}
                  className={classes.textField}
                  value={operation?.cnpjCli}
                />
              </div>
              <div className={classes.area2}>
                <TextField
                  id="nome"
                  label="Nome"
                  variant="filled"
                  type="text"
                  size="small"
                  disabled={true}
                  className={classes.textFieldName}
                  value={operation?.nomeCli}
                />
              </div>
              <div className={classes.area3}>
                <TextField
                  id="operacao"
                  label="Operação"
                  variant="filled"
                  type="text"
                  size="small"
                  disabled={true}
                  className={classes.textField}
                  value={operation?.nrOper}
                />
                <TextField
                  id="centro"
                  label="Centro"
                  variant="filled"
                  type="text"
                  size="small"
                  disabled={true}
                  className={classes.textField}
                  value={operation?.cenop}
                />
                <TextField
                  id="vlrContratado"
                  label="Valor Contratado"
                  variant="filled"
                  type="text"
                  size="small"
                  disabled={true}
                  className={classes.textField}
                  value={formatValue(operation.vlrOper)}
                />
              </div>
              <div className={classes.area4}>
                <TextField
                  id="dtFormalizacao"
                  label="Data Formalização"
                  variant="filled"
                  type="text"
                  size="small"
                  disabled={true}
                  className={classes.textField}
                  value={format(
                    parseISO(operation.dtFormalizacao),
                    'dd/MM/yyyy',
                  )}
                />
                <TextField
                  id="dtFinal"
                  label="Data Final"
                  variant="filled"
                  type="text"
                  size="small"
                  disabled={true}
                  className={classes.textField}
                  value={format(parseISO(operation.dtFinal), 'dd/MM/yyyy')}
                />
                <TextField
                  id="situacao"
                  label="Situação"
                  variant="filled"
                  type="text"
                  size="small"
                  disabled={true}
                  className={classes.textField}
                  value={operation?.situacao}
                />
              </div>
              <div className={classes.area5}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddDues}
                  // disabled={confirmation?.id === undefined ? false : true}
                  disabled={buttons}
                >
                  Adicionar Due
                </Button>
                <Tooltip title="Apenas para DUEs de uso total" arrow>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={buttons}
                    style={{ marginLeft: '10px' }}
                    onClick={handleFileDialog}
                  >
                    Adicionar arquivo csv
                  </Button>
                </Tooltip>
              </div>
              <div className={classes.area6}>
                {allDues.length > 0 &&
                  allDues.map((due, index) => (
                    <DueComponent
                      index={index}
                      key={due.id}
                      due={due}
                      operation={operation}
                      onError={setError}
                      changeTotal={handleChangeTotalDues}
                      onRemoval={handleRemoveDues}
                      onSucess={setSucess}
                      isDue={true}
                      confirmation={buttons}
                    />
                  ))}
                {dueFields > 0 &&
                  [...Array(dueFields)].map((k, i) => (
                    <DueComponent
                      index={i}
                      key={i}
                      operation={operation}
                      onError={setError}
                      onSave={setTotalDues}
                      changeTotal={handleChangeTotalDues}
                      onRemoval={handleRemoveDues}
                      onNewDue={handleAddNewDue}
                      onSucess={setSucess}
                      isDue={false}
                    />
                  ))}
              </div>
              {totalDues >= operation.vlrOper && (
                <div className={classes.area7}>
                  <TextField
                    id="observacoes"
                    label="Observações"
                    variant="standard"
                    type="text"
                    multiline
                    className={classes.textField}
                    fullWidth
                    style={{ width: '100%' }}
                    disabled={confirmation === undefined ? false : true}
                    value={
                      confirmation === undefined
                        ? observacoes
                        : confirmation.observacoes
                    }
                    onChange={event => setObservacoes(event.target.value)}
                  />
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <TextField
                id="totalDues"
                label="Valor Total das DUEs"
                variant="filled"
                type="text"
                size="small"
                disabled={true}
                className={classes.textFieldDues}
                value={formatValue(totalDues)}
                style={
                  totalDues >= operation.vlrOper
                    ? { backgroundColor: 'green' }
                    : { backgroundColor: 'red' }
                }
              />
              <Button variant="contained" color="secondary" onClick={onClose}>
                Fechar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  // buttons
                  handleConfirmationButton()
                  // totalDues >= operation.vlrOper ||
                  // confirmation?.id !== undefined
                  //   ? false
                  //   : true
                }
                onClick={handleSubmit}
              >
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </FormControl>
    </>
  );
}
