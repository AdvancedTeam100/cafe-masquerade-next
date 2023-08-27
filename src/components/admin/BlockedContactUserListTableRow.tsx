import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Column, Data } from '@/config/tableList/blockedContactUserList';
import { Typography } from '@material-ui/core';

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
}));

const TableCellContent = memo<{
  data: Data;
  column: Column;
  deleteItem: (blockedContactUserId: string) => void;
}>(({ data, column, deleteItem }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickOperation = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  switch (column.id) {
    case 'email': {
      return <Typography className={classes.cellText}>{data.email}</Typography>;
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
            <MenuItem
              onClick={() => {
                if (confirm('本当に削除しますか？')) {
                  deleteItem(data.id);
                }
                handleClose();
              }}
            >
              削除
            </MenuItem>
          </Menu>
        </>
      );
    }
    default:
      return <span className={classes.cellText}>{data[column.id]}</span>;
  }
});

const AdminBlockedContactUserListTableRow = memo<{
  data: Data;
  columns: Column[];
  deleteItem: (blockedContactUserId: string) => void;
}>(({ data, columns, deleteItem }) => {
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
            deleteItem={deleteItem}
          />
        </TableCell>
      ))}
    </TableRow>
  );
});

export default AdminBlockedContactUserListTableRow;
