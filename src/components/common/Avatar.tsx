import React from 'react';
import Image from 'next/image';
import { makeStyles } from '@material-ui/core/styles';
import MuiAvatar, { AvatarProps } from '@material-ui/core/Avatar';

const useStyles = makeStyles(() => ({
  avatar: {
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: 'white',
  },
}));

type Props = {
  src: string;
  size: number;
  fallbackSrc?: string;
  muiAvatarProps?: AvatarProps;
};

const Avatar = React.memo<Props>(
  ({ src, size, fallbackSrc, muiAvatarProps }) => {
    const classes = useStyles();
    return (
      <MuiAvatar
        src={src}
        style={{
          width: size,
          height: size,
        }}
        {...muiAvatarProps}
      >
        {fallbackSrc && (
          <Image
            src={fallbackSrc}
            alt="avatar"
            width={size}
            height={size}
            className={classes.avatar}
          />
        )}
      </MuiAvatar>
    );
  },
);

export default Avatar;
