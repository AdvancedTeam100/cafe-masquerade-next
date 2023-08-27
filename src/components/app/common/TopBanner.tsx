import React from 'react';
import Image from 'next/image';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100px',
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
  },
  link: {
    width: '300px',
    textDecoration: 'none',
    margin: theme.spacing(0, 1),
    '&:hover': {
      opacity: 0.7,
    },
  },
}));

const TopBanner = React.memo(() => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {/* 再度募集をかける場合があるので，コメントアウトしておく */}
      {/* <a className={classes.link} href="/recruit" target="_blank">
        <Image
          src="/banner_recruit_sm.png"
          width={300}
          height={100}
          objectFit="contain"
        />
      </a> */}
      <a
        className={classes.link}
        href="https://ci-en.dlsite.com/creator/7561"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Image
          src="/banner_online_salon.png"
          width={300}
          height={100}
          objectFit="contain"
        />
      </a>
      <a
        className={classes.link}
        href="https://cafemasquerade.booth.pm"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Image
          src="/banner_official_goods.png"
          width={300}
          height={100}
          objectFit="contain"
        />
      </a>
    </div>
  );
});

export default TopBanner;
