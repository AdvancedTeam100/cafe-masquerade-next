import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Data, columns } from '@/config/tableList/adminUserList';
import { AdminUser, adminRoleToDisplayName } from '@/libs/models/adminUser';
import { ThunkDispatch } from '@/store';
import {
  adminUserListOperations,
  adminUserListSelectors,
} from '@/store/admin/adminUserList';
import { castListOperations } from '@/store/admin/castList';
import AdminUserListTableRow from '@/components/admin/AdminUserListTableRow';
import AdminUserEditModal from '@/containers/admin/AdminUserEditModal';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    height: 'calc(100vh - 64px - 68px - 55px)',
    backgroundColor: theme.palette.background.default,
  },
}));

const getRows = (adminUserList: ReadonlyArray<AdminUser>): Data[] => {
  return adminUserList.map((item) => {
    return {
      id: item.uid,
      displayName: item.displayName,
      email: item.email,
      avatarUrl: item.avatarUrl,
      role: adminRoleToDisplayName[item.role],
      publicDisplayName: item.publicDisplayName,
      publicAvatarUrl: item.publicAvatarUrl,
    };
  });
};

const AdminUserList = () => {
  const classes = useStyles();
  const { isFetching, isInitialized, adminUserList } = useSelector(
    adminUserListSelectors.state,
  );
  const dispatch = useDispatch<ThunkDispatch>();
  const [editingAdminUser, setEditingAdminUser] = useState<AdminUser>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const getList = useCallback(() => {
    dispatch(adminUserListOperations.get());
  }, [dispatch]);
  const getCastList = useCallback(() => {
    dispatch(castListOperations.get());
  }, [dispatch]);

  useEffect(() => {
    if (!isFetching && !isInitialized) {
      getList();
    }
    getCastList();
  }, [isFetching, isInitialized, getList, getCastList]);

  const rows: Data[] = useMemo(() => getRows(adminUserList), [adminUserList]);

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

  const onClickEdit = (adminUserId: string) => {
    const adminUser = adminUserList.find((user) => user.uid === adminUserId);
    if (adminUser) {
      setEditingAdminUser(adminUser);
    }
  };

  return (
    <>
      <Paper className={classes.root}>
        {isFetching && <LinearProgress />}
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="admin-adminUser-list">
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
                <AdminUserListTableRow
                  data={row}
                  columns={columns}
                  onClickEdit={onClickEdit}
                  key={row.id}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
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
      {editingAdminUser && (
        <AdminUserEditModal
          adminUser={editingAdminUser}
          isOpened={editingAdminUser !== undefined}
          handleClose={() => setEditingAdminUser(undefined)}
        />
      )}
    </>
  );
};

export default AdminUserList;
