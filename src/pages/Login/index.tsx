import React, { useContext, useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { IoReload } from 'react-icons/io5';
import { Redirect } from 'react-router-dom';

import { UserContext } from '../../context/UserContext';

import userServices from '../../services/userService';
import useStyles from './styles';

export function Login() {
  const userData = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  const redirectOperations = async () => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  async function getUserInfo() {
    setLoading(true);

    const data = await (await userServices.getUser(document.cookie)).data;
    userData.createSession(
      data.matricula,
      data.displayname,
      data.prefixoDependencia,
      true,
    );

    redirectOperations();
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  const contentLoader = (
    <>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.loaderContainer}
      >
        <Grid item>
          <IoReload
            size={100}
            className={classes.loaderImage}
            color={'white'}
          />
          <style>{`
            @keyframes spin {
                 0% { transform: rotate(0deg); }
                 100% { transform: rotate(360deg); }
            }
        `}</style>
        </Grid>
      </Grid>
    </>
  );

  return <>{loading ? contentLoader : <Redirect to="/operations" />}</>;
}
