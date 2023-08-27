import { memo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Column, Data } from '@/config/tableList/castList';
import { colors } from '@/config/ui';
import { CastStatus } from '@/libs/models/cast';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    padding: theme.spacing(1, 1),
  },
  statusBadge: {
    borderRadius: '50%',
    width: '12px',
    height: '12px',
  },
  statusText: {
    fontSize: '12px',
    marginLeft: '8px',
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
  thumnbailContainer: {
    width: '150px',
    height: '90px',
  },
  thumbnailImage: {
    objectFit: 'contain',
  },
}));

const TableCellContent = memo<{
  data: Data;
  column: Column;
  handleChangeStatus: (castId: string, status: CastStatus) => void;
  deleteItem: (castId: string) => void;
  loadingCastId: string;
}>(({ data, column, handleChangeStatus, deleteItem, loadingCastId }) => {
  const classes = useStyles();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickOperation = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  switch (column.id) {
    case 'id': {
      return (
        <Link href={'/admin/cast/[id]'} as={`/admin/cast/${data.id}`}>
          <a className={classes.cellLink}>{data.id}</a>
        </Link>
      );
    }
    case 'name': {
      return (
        <Link href={'/admin/cast/[id]'} as={`/admin/cast/${data.id}`}>
          <a className={classes.cellLink}>{data.name}</a>
        </Link>
      );
    }
    case 'status': {
      const isPublished = data.status === CastStatus.Published;
      return (
        <div className={classes.flex}>
          {loadingCastId === data.id ? (
            <CircularProgress size={24} />
          ) : (
            <Select
              value={data.status}
              onChange={(e) =>
                handleChangeStatus(data.id, e.target.value as CastStatus)
              }
            >
              <MenuItem value={CastStatus.Published}>
                <div className={clsx(classes.flex, classes.status)}>
                  <div
                    className={classes.statusBadge}
                    style={{
                      background: colors.green,
                    }}
                  />
                  <span className={classes.statusText}>
                    {isPublished ? '公開中' : '公開中に変更'}
                  </span>
                </div>
              </MenuItem>
              <MenuItem value={CastStatus.Draft}>
                <div className={clsx(classes.flex, classes.status)}>
                  <div
                    className={classes.statusBadge}
                    style={{
                      background: colors.semiDarkGray,
                    }}
                  />
                  <span className={classes.statusText}>
                    {isPublished ? '下書きに変更' : '下書き'}
                  </span>
                </div>
              </MenuItem>
            </Select>
          )}
        </div>
      );
    }
    case 'imageUrl': {
      return (
        <div className={classes.thumnbailContainer}>
          <img
            src={data.imageUrl}
            alt={data.id}
            width={150}
            height={90}
            className={classes.thumbnailImage}
          />
        </div>
      );
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
                router.push('/admin/cast/[castId]', `/admin/cast/${data.id}`);
                handleClose();
              }}
            >
              編集
            </MenuItem>
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

const AdminCastListTableRow = memo<{
  data: Data;
  columns: Column[];
  handleChangeStatus: (castId: string, status: CastStatus) => void;
  deleteItem: (castId: string) => void;
  loadingCastId: string;
}>(({ data, columns, handleChangeStatus, deleteItem, loadingCastId }) => {
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
            handleChangeStatus={handleChangeStatus}
            deleteItem={deleteItem}
            loadingCastId={loadingCastId}
          />
        </TableCell>
      ))}
    </TableRow>
  );
});

export default AdminCastListTableRow;
