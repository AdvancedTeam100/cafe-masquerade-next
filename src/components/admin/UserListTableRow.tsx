import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Column, Data } from '@/config/tableList/userList';
import RoleIcon from '@/components/common/RoleIcon';
import { userRoleToDisplayName } from '@/libs/models/user';

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
  cellSelector: {
    fontSize: '14px',
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.text.secondary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 4px 8px',
  },
}));

const TableCellContent = memo<{
  data: Data;
  column: Column;
  onClickRole: (userId: string) => void;
}>(({ data, column, onClickRole }) => {
  const classes = useStyles();

  switch (column.id) {
    case 'avatarUrl': {
      return <Avatar src={data.avatarUrl} />;
    }
    case 'role': {
      return (
        <div
          className={classes.cellSelector}
          onClick={() => onClickRole(data.uid)}
        >
          <div className={classes.flex}>
            <RoleIcon role={data.role} />
            <span style={{ margin: '0 8px 0 4px' }}>
              {userRoleToDisplayName[data.role]}
            </span>
          </div>
          <ArrowDropDownIcon fontSize="small" />
        </div>
      );
    }
    default:
      return <span className={classes.cellText}>{data[column.id]}</span>;
  }
});

const UserListTableRow = memo<{
  data: Data;
  columns: Column[];
  onClickRole: (userId: string) => void;
}>(({ data, columns, onClickRole }) => {
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
            onClickRole={onClickRole}
          />
        </TableCell>
      ))}
    </TableRow>
  );
});

export default UserListTableRow;
