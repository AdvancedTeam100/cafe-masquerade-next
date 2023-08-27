import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
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
import { Cast, CastStatus } from '@/libs/models/cast';
import { Data, columns } from '@/config/tableList/castList';
import { ThunkDispatch } from '@/store';
import { castListOperations, castListSelectors } from '@/store/admin/castList';
import { castOperations } from '@/store/admin/cast';
import { getDateString, getDateTimeString } from '@/libs/utils/dateFormat';
import CastListTableRow from '@/components/admin/CastListTableRow';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    height: 'calc(100vh - 64px - 68px - 55px)',
    backgroundColor: theme.palette.background.default,
  },
}));

const getRows = (castList: ReadonlyArray<Cast>): Data[] => {
  return castList.map((item) => {
    return {
      id: item.id,
      status: item.status,
      imageUrl: item.imageUrl,
      name: item.name,
      tags: item.tags.join(', '),
      joinedAt: getDateString(item.joinedAt),
      createdAt: getDateTimeString(item.createdAt),
      updatedAt: getDateTimeString(item.updatedAt),
    };
  });
};

const AdminCastList = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { isFetching, isInitialized, castList, loadingCastId } = useSelector(
    castListSelectors.state,
  );
  const dispatch = useDispatch<ThunkDispatch>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getList = useCallback(() => {
    dispatch(castListOperations.get());
  }, [dispatch]);

  const changeStatus = useCallback(
    (castId: string, castStatus: CastStatus) => {
      dispatch(
        castOperations.updateStatus(
          castId,
          castStatus,
          () => {
            enqueueSnackbar('公開設定を更新しました', {
              variant: 'success',
            });
          },
          () => {
            enqueueSnackbar('公開設定の更新に失敗しました', {
              variant: 'error',
            });
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar],
  );

  const deleteCast = useCallback(
    (castId: string) => {
      dispatch(
        castOperations.deleteCast(
          castId,
          () => {
            enqueueSnackbar('お知らせを削除しました', {
              variant: 'success',
            });
          },
          () => {
            enqueueSnackbar('お知らせを削除しました', {
              variant: 'error',
            });
          },
        ),
      );
    },
    [dispatch, enqueueSnackbar],
  );

  useEffect(() => {
    if (!isFetching && !isInitialized) {
      getList();
    }
  }, [isFetching, isInitialized, getList]);

  const rows: Data[] = useMemo(() => getRows(castList), [castList]);

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

  return (
    <Paper className={classes.root}>
      {isFetching && <LinearProgress />}
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="admin-cast-list">
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
              <CastListTableRow
                key={row.id}
                data={row}
                columns={columns}
                handleChangeStatus={changeStatus}
                deleteItem={deleteCast}
                loadingCastId={loadingCastId}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
      <TablePagination
        rowsPerPageOptions={[10, 30, 50]}
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
  );
};

export default AdminCastList;
