import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import FileDownloadIcon from '@material-ui/icons/CloudDownload';
import { Data, columns } from '@/config/tableList/userList';
import {
  Sex,
  User,
  UserRole,
  sexLabel,
  userRoleToDisplayName,
} from '@/libs/models/user';
import { ThunkDispatch } from '@/store';
import { userListOperations, userListSelectors } from '@/store/admin/userList';
import UserListTableRow from '@/components/admin/UserListTableRow';
import UserRoleEditModal from '@/containers/admin/UserRoleEditModal';
import { getDateString } from '@/libs/utils/dateFormat';
import dayjs from 'dayjs';
import { zoneNameToDisplayName, zones } from '@/libs/utils/zone';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    height: 'calc(100vh - 64px - 68px - 55px)',
    backgroundColor: theme.palette.background.default,
  },
  tableHeader: {
    padding: theme.spacing(1, 2, 1.5),
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const getRows = (userList: ReadonlyArray<User>): Data[] => {
  return userList.map((item) => {
    return {
      uid: item.uid,
      displayName: item.displayName,
      email: item.email,
      avatarUrl: item.avatarUrl,
      role: item.role,
      discordId: item.discordId ?? '',
      dateOfBirth: item.dateOfBirth ? getDateString(item.dateOfBirth) : '',
      sex: item.sex ? sexLabel[item.sex] : '',
      prefecture: item.prefecture ? zoneNameToDisplayName(item.prefecture) : '',
      createdAt: getDateString(item.createdAt),
    };
  });
};

const UserList = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { isFetching, isInitialized, userList } = useSelector(
    userListSelectors.state,
  );
  const dispatch = useDispatch<ThunkDispatch>();
  const [editingUser, setEditingUser] = useState<User>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [inpurtQuery, setInputQuery] = useState('');

  const getList = useCallback(() => {
    dispatch(userListOperations.get());
  }, [dispatch]);

  const updateAllUsersRole = useCallback(() => {
    if (confirm('ユーザーの会員ランクを一括更新します')) {
      dispatch(
        userListOperations.updateAllUsersRole(
          () => {
            enqueueSnackbar('ユーザーの会員ランクを更新しました', {
              variant: 'success',
            });
          },
          () => {
            enqueueSnackbar('ユーザーの会員ランクの更新に失敗しました', {
              variant: 'error',
            });
          },
        ),
      );
    }
  }, [dispatch, enqueueSnackbar]);

  const downloadUserListCSV = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();

      const outputColumns = columns.filter(({ id }) => id !== 'avatarUrl');
      const columnsCSV = outputColumns.map((column) => column.label).join(',');
      const userListCSV = userList
        .map((user) =>
          outputColumns
            .map((column) => {
              const value = user[column.id];

              switch (column.id) {
                case 'createdAt':
                  return dayjs(value).format('YYYY/MM/DD');

                case 'dateOfBirth':
                  return dayjs(value).format('YYYY/MM/DD');

                case 'sex':
                  return sexLabel[value as Sex] ?? 'その他';

                case 'role':
                  return userRoleToDisplayName[value as UserRole] ?? '';

                case 'prefecture':
                  return zones.filter((v) => v.name === value)[0]?.displayName;

                default:
                  return value;
              }
            })
            .join(','),
        )
        .join('\n');

      const blob = new Blob([[columnsCSV, userListCSV].join('\n')]);
      const url = URL.createObjectURL(blob);

      const anchorTemp = document.createElement('a');
      document.body.appendChild(anchorTemp);
      anchorTemp.download = 'user_list.csv';
      anchorTemp.href = url;

      anchorTemp.click();
      anchorTemp.remove();
      URL.revokeObjectURL(url);
    },
    [userList],
  );

  useEffect(() => {
    if (!isFetching && !isInitialized) {
      getList();
    }
  }, [isFetching, isInitialized, getList]);

  const rows: Data[] = useMemo(() => {
    let users = userList;
    if (inpurtQuery.length > 1) {
      const query = inpurtQuery.toLocaleLowerCase().trim();
      users = userList.filter(
        (user) =>
          user.displayName.toLocaleLowerCase().includes(query) ||
          user.email.toLocaleLowerCase().includes(query),
      );
    }
    return getRows(users);
  }, [userList, inpurtQuery]);

  const currentRows: Data[] = useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, page, rowsPerPage],
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onClickRole = (userId: string) => {
    const user = userList.find((user) => user.uid === userId);
    if (user) {
      setEditingUser(user);
    }
  };

  return (
    <>
      <Paper className={classes.root}>
        <div className={classes.tableHeader}>
          <div>
            <Button
              variant="outlined"
              color="primary"
              onClick={updateAllUsersRole}
              disabled={isFetching}
              startIcon={<SyncIcon />}
            >
              会員ランク一括最新化
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={downloadUserListCSV}
              disabled={isFetching}
              startIcon={<FileDownloadIcon />}
              style={{ marginLeft: 16 }}
            >
              CSVをダウンロード
            </Button>
          </div>
          <TextField
            placeholder="ユーザーを検索"
            onChange={(e) => setInputQuery(String(e.target.value))}
          />
        </div>
        {isFetching && <LinearProgress />}
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="admin-user-list">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      width: column.width,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map((row) => (
                <UserListTableRow
                  data={row}
                  columns={columns}
                  onClickRole={onClickRole}
                  key={row.uid}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <TablePagination
          rowsPerPageOptions={[50, 100, 200]}
          labelRowsPerPage="1ページあたりの行数"
          backIconButtonText="前のページ"
          nextIconButtonText="次のページ"
          labelDisplayedRows={({ from, to, count }) =>
            `全${count}件中 ${from}〜${to}件目`
          }
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {editingUser && (
        <UserRoleEditModal
          user={editingUser}
          isOpened={editingUser !== undefined}
          handleClose={() => setEditingUser(undefined)}
        />
      )}
    </>
  );
};

export default UserList;
