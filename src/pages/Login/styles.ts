import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  loaderContainer: {
    position: 'relative',
    height: '900px',
    backgroundColor: '#002D4B',
  },
  loaderImage: {
    animation: 'spin 2s linear infinite',
  },
}));

export default useStyles;
