import React, { useState } from 'react';
import { Divider, Typography, Link } from '@material-ui/core';
import useStyles from './styles';
import DevelopersInfo from '../../../../components/DevelopersInfo';

export default function Footer() {
  const classes = useStyles();
  const [showDevelopers, setShowDevelopers] = useState(false);

  return (
    <div className={classes.root}>
      <Divider />
      <Typography className={classes.copyright} variant="body1">
        <Link href="https://github.com/Whymeet/cinema-plus" target="_blank" rel="noopener" className={classes.link}>
          @https://github.com/Whymeet/cinema-plus
        </Link>
        {' | '}
        <Link component="button" onClick={() => setShowDevelopers(true)} className={classes.link}>
          Сведения о разработчиках
        </Link>
      </Typography>
      <DevelopersInfo open={showDevelopers} onClose={() => setShowDevelopers(false)} />
    </div>
  );
}
