import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: 1200,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateAreas:
        "'area1 area1 area1' 'area2 area2 area2' 'area3 area3 area3' 'area4 area4 area4' 'area5 area5 area5' 'area6 area6 area6' 'area7 area7 area7'",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
      padding: '5px 5px',
    },
    textFieldName: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '80%',
      padding: '5px 5px',
    },
    textFieldDues: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
      padding: '5px 5px',
    },
    area1: {
      gridArea: 'area1',
      maxHeight: '10%',
    },
    area2: {
      gridArea: 'area2',
      maxHeight: '10%',
    },
    area3: {
      gridArea: 'area3',
      maxHeight: '10%',
      width: '700px',
    },
    area4: {
      gridArea: 'area4',
      maxHeight: '10%',
      width: '700px',
    },
    area5: {
      gridArea: 'area5',
      justifySelf: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      padding: '5px 0',
    },
    area6: {
      gridArea: 'area6',
      justifySelf: 'center',
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      maxWidth: 1200,
      justifyContent: 'center',
      alignContent: 'center',
      marginTop: 5,
      padding: '5px 0',
    },
    area7: {
      gridArea: 'area7',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      padding: '5px 0',
      maxWidth: 1000,
    },
    paper: {
      maxWidth: 1200,
    },
  }),
);

export default useStyles;
