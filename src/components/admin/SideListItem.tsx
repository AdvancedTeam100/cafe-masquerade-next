import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Theme, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { SideListItem } from '@/config/adminSideListItem';
import { colors } from '@/config/ui';

type Props = {
  item: SideListItem;
};

const useStyles = makeStyles<Theme, { isSelected: boolean }>((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  listItemRoot: {
    backgroundColor: ({ isSelected }) =>
      isSelected ? colors.backgroundGraySelected : 'inherit',
    borderLeft: ({ isSelected }) =>
      isSelected
        ? `3px solid ${theme.palette.primary.main}`
        : '3px solid transparent',
    color: ({ isSelected }) =>
      isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
  },
  listItemIconRoot: {
    minWidth: '40px',
    color: ({ isSelected }) =>
      isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
  },
}));

const AdminSideListItem = React.memo<Props>(({ item }) => {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(false);
  const classes = useStyles({ isSelected });
  useEffect(() => {
    if (router.pathname === item.key) {
      setIsSelected(true);
    }
  }, [router.pathname, item.key]);
  return (
    <Link href={item.href}>
      <a className={classes.link}>
        <ListItem
          button
          key={item.key}
          classes={{ root: classes.listItemRoot }}
        >
          <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
      </a>
    </Link>
  );
});

export default AdminSideListItem;
