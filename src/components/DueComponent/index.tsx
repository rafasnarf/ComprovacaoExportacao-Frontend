import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { IoCloseCircle, IoCheckmarkCircleSharp } from 'react-icons/io5';
import { DueDTO } from '../../dtos/DueDTO';
import { Operation } from '../../dtos/OperationsDTO';
import { api } from '../../services/api';

import useStyles from './styles';

type DueComponentProps = {
  due?: DueDTO;
  onError: (errorData: Error) => void;
  onSucess: (sucessData: Error) => void;
  operation: Operation;
  onSave?: (total: number) => void;
  changeTotal: (index: number, due: DueDTO) => void;
  index: number;
  onRemoval: (index: number, due: DueDTO) => void;
  onNewDue?: (due: DueDTO) => void;
  isDue: boolean;
  confirmation?: boolean;
};

type Error = {
  message: string;
  isError: boolean;
};

export function DueComponent({
  due,
  operation,
  onError,
  onSucess,
  onSave,
  changeTotal,
  index,
  onRemoval,
  onNewDue,
  isDue,
  confirmation,
}: DueComponentProps) {
  const [nrDue, setNrDue] = useState(due !== undefined ? due.nrDue : '');
  const [chaveDue, setChaveDue] = useState(
    due !== undefined ? due.chaveDue : '',
  );
  const [vlrDue, setVlrDue] = useState(
    due !== undefined ? due.valorDue.toString() : '',
  );
  const [dueButton, setDueButton] = useState(due !== undefined ? true : false);
  const [usoParcial, setUsoParcial] = useState(
    due === undefined ? false : !due.usoTotal,
  );
  const [vlrTotalDue, setVlrTotalDue] = useState(
    due !== undefined ? due.valorTotalDue?.toString() : '',
  );

  function handleButtonColor() {
    if (due === undefined) {
      if (usoParcial) {
        if (vlrTotalDue?.trim().length === 0) {
          return <IoCloseCircle className={classes.saveButton} color={'red'} />;
        } else {
          return (
            <IoCheckmarkCircleSharp
              className={classes.saveButton}
              color={'green'}
            />
          );
        }
      } else if (
        nrDue.trim().length === 0 ||
        vlrDue.trim().length === 0 ||
        chaveDue.trim().length === 0
      ) {
        return <IoCloseCircle className={classes.saveButton} color={'red'} />;
      } else {
        return (
          <IoCheckmarkCircleSharp
            className={classes.saveButton}
            color={'green'}
          />
        );
      }
    } else {
      return (
        <IoCheckmarkCircleSharp
          className={classes.saveButton}
          color={'green'}
        />
      );
    }
  }

  function handleChanges(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const id = event.target.id;
    const value = event.target.value;

    switch (id) {
      case 'nrDue':
        setNrDue(value.replace('-', ''));
        break;
      case 'vlrDue':
        const newValue = value.replace('.', '');
        newValue.replace(',', '.');
        setVlrDue(newValue);
        break;
      case 'chaveDue':
        setChaveDue(value);
        break;
      case 'valorTotalDue':
        const dueValue = value.replace('.', '');
        dueValue.replace(',', '.');
        setVlrTotalDue(dueValue);
        break;
      case 'usoParcial':
        setUsoParcial(event.target.checked);
        break;
      default:
        break;
    }
  }

  async function handleClick() {
    if (due !== undefined) {
      if (dueButton) {
        handleDueButton();
        return;
      } else {
        if (due.id !== undefined) {
          handleChangeDue(due.id);
          return;
        }
      }
    } else {
      const foundedDue = await api.get('/due/findDue', {
        params: { nrDue: nrDue },
      });

      if (foundedDue.data === '') {
        handleSaveDue();
        return;
      }

      const { id, usoTotal, radicalCNPJ, valorTotalDue, nrOperDue } =
        foundedDue.data;
      if (nrOperDue === operation.nrOper) {
        onError({
          message: 'DUE já cadastrada para essa operação',
          isError: true,
        });
      }
      if (usoTotal) {
        onError({
          message: 'DUE já cadastrada com uso total do valor',
          isError: true,
        });
        return;
      } else {
        if (radicalCNPJ === operation.cnpjCli.toString().slice(0, -6)) {
          onError({
            message: 'DUE já cadastrata nesta operação',
            isError: true,
          });
          return;
        }
      }
      handleDueButton();
      handleChangeDue(id);
    }
  }

  async function handleChangeDue(id: string) {
    const valorDue = Number(vlrDue.replace(',', '.'));
    const valorTotalDue = Number(vlrTotalDue?.replace(',', '.'));

    let updateData: DueDTO;
    if (usoParcial) {
      if (isNaN(valorTotalDue)) {
        onError({
          message: 'Para os valores digite apenas os números',
          isError: true,
        });
        setVlrTotalDue('');
        return;
      } else if (isNaN(valorDue)) {
        onError({
          message: 'Para os valores digite apenas os números',
          isError: true,
        });
        setVlrDue('');
        return;
      }
      updateData = {
        id,
        nrDue: nrDue,
        chaveDue: chaveDue,
        valorDue: Number(vlrDue.replace(',', '.')),
        nrOperDue: operation.nrOper,
        usoTotal: !usoParcial,
        valorTotalDue: Number(vlrTotalDue?.replace(',', '.')),
      };
    } else {
      if (isNaN(valorDue)) {
        onError({
          message: 'Para os valores digite apenas os números',
          isError: true,
        });
        setVlrDue('');
        return;
      }
      updateData = {
        id,
        nrDue: nrDue,
        chaveDue: chaveDue,
        valorDue: Number(vlrDue.replace(',', '.')),
        nrOperDue: operation.nrOper,
        usoTotal: !usoParcial,
      };
    }

    const response = await api.put('/due', updateData);

    const changedDue = response.data;

    if (changedDue === false) {
      onError({ message: 'Falha ao atualizar Due', isError: true });
      return;
    }
    handleDueButton();
    onSucess({
      message: `DUE ${changedDue.nrDue} atualizada com sucesso`,
      isError: true,
    });
    changeTotal(index, updateData);
  }

  async function handleSaveDue() {
    const correctVlr = vlrDue.replace(',', '.');
    const numberVlrDue = Number(correctVlr);

    if (isNaN(numberVlrDue)) {
      onError({ message: 'Digite apenas números', isError: true });
      setVlrDue('');
      return;
    }

    let data: DueDTO;

    if (usoParcial) {
      const numberVlrTotalDue = Number(vlrTotalDue?.replace(',', '.'));
      if (isNaN(numberVlrTotalDue)) {
        onError({ message: 'Digite apenas números', isError: true });
        setVlrTotalDue('');
        return;
      }
      data = {
        nrDue,
        chaveDue,
        valorDue: numberVlrDue,
        nrOperDue: operation?.nrOper,
        cnpjOper: operation.cnpjCli,
        usoTotal: !usoParcial,
        valorTotalDue: numberVlrTotalDue,
      };
    } else {
      data = {
        nrDue,
        chaveDue,
        nrOperDue: operation?.nrOper,
        cnpjOper: operation.cnpjCli,
        valorDue: numberVlrDue,
        usoTotal: !usoParcial,
      };
    }

    const response = await api.post('/due', data);
    const statusResponse = response.data;

    if (statusResponse.statusCode === 400) {
      onError({ message: statusResponse.message, isError: true });
      return;
    } else if (onSave !== undefined) {
      handleDueButton();
    }
    if (onNewDue !== undefined) {
      onNewDue(statusResponse);
    }
    onSucess({
      message: `DUE ${statusResponse.nrDue} salva com suceso`,
      isError: true,
    });
    return;
  }

  async function handleRemoveDue() {
    if (isDue) {
      if (due !== undefined) {
        const findDue = await api.get('/due/findDue', {
          params: {
            id: due.id,
          },
        });
        const dueData: DueDTO = findDue.data;
        if (dueData !== undefined) {
          const removedDue = await api.delete('/due', {
            data: { id: dueData.id },
          });

          if (removedDue.data === false) {
            onError({ message: 'Falha ao exluir DUE', isError: true });
          }
          onSucess({ message: `DUE removida com sucesso`, isError: true });
          onRemoval(index, dueData);
        }
      }
      return;
    } else {
      const findDue = await api.get('/due/findDue', {
        params: {
          nrDue: nrDue,
        },
      });
      console.log('aqui');

      const dueData: DueDTO = findDue.data;

      if (dueData !== undefined) {
        const removedDue = await api.delete('/due', {
          data: { id: dueData.id },
        });

        if (removedDue.data === false) {
          onError({ message: 'Falha ao exluir DUE', isError: true });
        }
        onSucess({ message: `DUE removida com sucesso`, isError: true });
        onRemoval(index, dueData);
      }
      return;
    }
  }

  function handleDueButton() {
    if (!dueButton) {
      setDueButton(true);
    } else {
      setDueButton(false);
    }
  }

  useEffect(() => {
    handleButtonColor();
  }, [dueButton]);

  const classes = useStyles();
  return (
    <>
      <div className={classes.container}>
        <TextField
          id="nrDue"
          label="Nr. DUE"
          variant="outlined"
          type="text"
          size="small"
          className={classes.textField}
          value={nrDue}
          disabled={dueButton}
          onChange={event => handleChanges(event)}
        />
        <TextField
          id="chaveDue"
          label="Chave da DUE"
          variant="outlined"
          type="text"
          size="small"
          className={classes.textField}
          value={chaveDue}
          disabled={dueButton}
          onChange={event => handleChanges(event)}
        />
        <TextField
          id="vlrDue"
          label="Valor DUE"
          variant="outlined"
          type="text"
          size="small"
          className={classes.textField}
          value={vlrDue}
          disabled={dueButton}
          onChange={event => handleChanges(event)}
        />
        <FormControlLabel
          label="Uso parcial"
          labelPlacement="end"
          control={
            <Checkbox
              name="usoParcial"
              id="usoParcial"
              onChange={event => handleChanges(event)}
              disabled={dueButton}
              checked={usoParcial}
            />
          }
        />
        {usoParcial ? (
          <TextField
            id="valorTotalDue"
            label="Valor Total da DUE"
            variant="outlined"
            type="text"
            size="small"
            className={classes.textField}
            value={vlrTotalDue}
            disabled={dueButton}
            onChange={event => handleChanges(event)}
          />
        ) : (
          ''
        )}
        <Tooltip title="Adicionar ou Alterar DUE" arrow>
          <Button
            variant="outlined"
            style={{
              alignSelf: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              justifySelf: 'center',
              padding: '5px 0 15px 0',
              width: '35px',
              height: '40px',
            }}
            onClick={handleClick}
            disabled={confirmation}
          >
            {handleButtonColor()}
          </Button>
        </Tooltip>
        <Tooltip title="Remover DUE" arrow>
          <Button
            variant="outlined"
            style={{
              alignSelf: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              justifySelf: 'center',
              padding: '5px 0 15px 0',
              width: '35px',
              height: '40px',
              marginLeft: '10px',
            }}
            onClick={handleRemoveDue}
            disabled={confirmation}
          >
            <IoCloseCircle className={classes.saveButton} color={'red'} />
          </Button>
        </Tooltip>
      </div>
    </>
  );
}
