import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      maxWidth: 1140,
    },
    textField: {
      width: 200,
      padding: '10px 5px',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      justifyContent: 'center',
      alignContent: 'center',
    },
    saveButton: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      justifySelf: 'center',
      alignSelf: 'center',
      width: 30,
      height: 30,
      marginTop: 10,
    },
  }),
);

export default useStyles;
