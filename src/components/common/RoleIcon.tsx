import { memo } from 'react';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { UserRole } from '@/libs/models/user';
import { AdminRole } from '@/libs/models/adminUser';
import { colors } from '@/config/ui';

type Props = {
  role: AdminRole | UserRole | 'nonUser';
  size?: number;
};

const useStyles = makeStyles<Theme, { size: number }>(() => ({
  circle: {
    width: ({ size }) => `${size}px`,
    height: ({ size }) => `${size}px`,
    borderRadius: '50%',
  },
}));

const RoleIcon = memo<Props>(({ role, size = 16 }) => {
  const classes = useStyles({ size });
  switch (role) {
    case 'diamond':
      return (
        <img
          src="/svg/role_diamond.svg"
          alt="diamond"
          width={size}
          height={size}
        />
      );
    case 'platinum':
      return (
        <img
          src="/svg/role_platinum.svg"
          alt="platinum"
          width={size}
          height={size}
        />
      );
    case 'gold':
      return (
        <div
          className={classes.circle}
          style={{ backgroundColor: colors.roleGold }}
        />
      );
    case 'silver':
      return (
        <div
          className={classes.circle}
          style={{ backgroundColor: colors.roleSilver }}
        />
      );
    case 'bronze':
      return (
        <div
          className={classes.circle}
          style={{ backgroundColor: colors.roleBlonze }}
        />
      );
    case 'superAdmin':
    case 'admin':
    case 'cast':
      return (
        <div
          className={classes.circle}
          style={{ backgroundColor: colors.vividPink }}
        />
      );
    case 'normal':
      return (
        <div
          className={classes.circle}
          style={{ border: `1px solid ${colors.roleBlonze}` }}
        />
      );
    default:
      return (
        <div
          className={classes.circle}
          style={{ border: `1px solid ${colors.roleSilver}` }}
        />
      );
  }
});

export default RoleIcon;
