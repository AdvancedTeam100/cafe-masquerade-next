import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Column, Data } from '@/config/tableList/adminUserList';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRow: {
    backgroundColor: theme.palette.background.paper,
  },
  cellText: {
    fontSize: '14px',
  },
  cellLink: {
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  },
}));

const TableCellContent = memo<{
  data: Data;
  column: Column;
  onClickEdit: (adminUserId: string) => void;
}>(({ data, column, onClickEdit }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickOperation = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  switch (column.id) {
    case 'avatarUrl': {
      return <Avatar src={data.avatarUrl} />;
    }
    case 'publicAvatarUrl': {
      return <Avatar src={data.publicAvatarUrl} />;
    }
    case 'operation': {
      return (
        <>
          <IconButton onClick={handleClickOperation}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => onClickEdit(data.id)}>編集</MenuItem>
          </Menu>
        </>
      );
    }
    default:
      return <span className={classes.cellText}>{data[column.id]}</span>;
  }
});

const AdminUserListTableRow = memo<{
  data: Data;
  columns: Column[];
  onClickEdit: (adminUserId: string) => void;
}>(({ data, columns, onClickEdit }) => {
  const classes = useStyles();
  return (
    <TableRow hover role="checkbox" tabIndex={-1} className={classes.tableRow}>
      {columns.map((column: Column) => (
        <TableCell
          key={column.id}
          align={column.align}
          style={{
            minWidth: column.minWidth,
            maxWidth: column.maxWidth,
            width: column.width,
          }}
        >
          <TableCellContent
            data={data}
            column={column}
            onClickEdit={onClickEdit}
          />
        </TableCell>
      ))}
    </TableRow>
  );
});

export default AdminUserListTableRow;
