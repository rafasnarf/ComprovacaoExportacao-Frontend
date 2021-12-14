import React, { forwardRef, useState } from 'react';

import MaterialTable, { Icons } from 'material-table';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@material-ui/icons';
import ptBRLocale from 'date-fns/locale/pt-BR';
import { MenuItem, Select } from '@material-ui/core';

import { Operation } from '../../dtos/OperationsDTO';
import { ManualConfirmationDTO } from '../../dtos/ManualConfirmationsDTO';
import { api } from '../../services/api';
import { DueDTO } from '../../dtos/DueDTO';

type DataTableProps = {
  operations: Operation[];
  // confirmations: ManualConfirmationDTO[];
  onOpenSearch: () => void;
  onClickRow: (
    operation: Operation,
    dues: DueDTO[],
    confirmation: ManualConfirmationDTO | undefined,
  ) => void;
};

export function DataTable({
  operations,
  // confirmations,
  onOpenSearch,
  onClickRow,
}: DataTableProps) {
  const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  const CustomDatePicker = (props: any) => {
    const [date, setDate] = useState<Date | null>(null);

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBRLocale}>
        <DatePicker
          inputVariant="standard"
          size="small"
          variant="dialog"
          format="dd/MM/yyyy"
          value={date}
          clearable={true}
          disableFuture
          style={{ minWidth: 175 }}
          onChange={event => {
            setDate(event);
            props.onFilterChanged(props.columnDef.tableData.id, event);
          }}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const CustomSituacaoPicker = (props: any) => {
    const [situacao, setSituacao] = useState<String | unknown>('');

    return (
      <Select
        value={situacao}
        onChange={event => {
          const value = event.target.value;
          setSituacao(value);
          props.onFilterChanged(
            props.columnDef.tableData.id,
            event.target.value,
          );
        }}
      >
        <MenuItem value={''}>Todos</MenuItem>
        <MenuItem value={'VENCIDA'}>VENCIDA</MenuItem>
        <MenuItem value={'EM SER'}>EM SER</MenuItem>
      </Select>
    );
  };

  async function handleOpenConfirmation(rowData: Operation) {
    const responseConfirmation = await api.get(
      '/manualconfirmation/operation',
      {
        params: {
          nrOper: rowData.nrOper,
        },
      },
    );
    const response = await api.get('/due', {
      params: {
        operation: rowData.nrOper,
      },
    });

    const foundedDues = response.data;
    const confirmation = responseConfirmation.data;
    onClickRow(rowData, foundedDues, confirmation);
  }

  return (
    <MaterialTable
      title="Operações para Comprovação de Exportação"
      columns={[
        { title: 'MCI', field: 'mci', type: 'string' },
        { title: 'CNPJ', field: 'cnpjCli', type: 'string' },
        {
          title: 'Nome',
          field: 'nomeCli',
          type: 'string',
          cellStyle: { width: '20%' },
        },
        { title: 'Operação', field: 'nrOper', type: 'string' },
        { title: 'Cenop', field: 'cenop', type: 'string' },
        { title: 'Vlr. Contratado', field: 'vlrOper', type: 'currency' },
        {
          title: 'Dt. Formalização',
          field: 'dtFormalizacao',
          type: 'date',
          filterComponent: props => <CustomDatePicker {...props} />,
        },
        {
          title: 'Dt. Final',
          field: 'dtFinal',
          type: 'date',
          filterComponent: props => <CustomDatePicker {...props} />,
        },
        {
          title: 'Situação',
          field: 'situacao',
          type: 'string',
          filterComponent: props => <CustomSituacaoPicker {...props} />,
        },
      ]}
      data={operations}
      icons={tableIcons}
      options={{
        filtering: true,
        exportButton: true,
        exportAllData: true,
        search: false,
        pageSize: 10,
        pageSizeOptions: [10, 20, 40],
        headerStyle: {
          padding: '0 10px',
          textAlign: 'center',
          fontSize: 15,
        },
        rowStyle: {
          padding: '5px 20px',
          textAlign: 'center',
          textJustify: 'none',
          fontSize: 15,
        },
      }}
      localization={{
        body: {
          dateTimePickerLocalization: ptBRLocale,
        },
      }}
      actions={[
        {
          icon: Search,
          tooltip: 'Abre painel de pesquisa',
          position: 'toolbar',
          onClick: onOpenSearch,
        },
      ]}
      onRowClick={(event, rowData) => {
        if (rowData !== undefined) {
          handleOpenConfirmation(rowData);
        }
      }}
    />
  );
}
