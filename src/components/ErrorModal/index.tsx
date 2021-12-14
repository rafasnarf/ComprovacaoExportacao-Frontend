import React from 'react';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    message: {
      fontSize: '25px',
      textAlign: 'center',
    },
  }),
);

export function ErrorModal(props: any) {
  const classes = useStyles();
  return (
    <div>
      <Dialog open={props.showError}>
        <DialogTitle>Erro na pesquisa</DialogTitle>
        <DialogContent className={classes.message}>
          {props.messageError}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} variant="contained" color="secondary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
