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
import { Data, columns } from '@/config/tableList/videoList';
import { Video } from '@/libs/models/video';
import { ThunkDispatch } from '@/store';
import {
  videoListOperations,
  videoListSelectors,
} from '@/store/admin/videoList';
import { getDateTimeString } from '@/libs/utils/dateFormat';
import VideoListTableRow from '@/components/admin/VideoListTableRow';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    height: 'calc(100vh - 64px - 68px - 55px)',
    backgroundColor: theme.palette.background.default,
  },
}));

const getRows = (videoList: ReadonlyArray<Video>): Data[] => {
  return videoList.map((item) => {
    return {
      id: item.id,
      status: item.status,
      uploadStatus: item.uploadStatus,
      thumbnailUrl: item.thumbnailUrl,
      title: item.title,
      type: item.type,
      requiredRole: item.requiredRole,
      publishedAt: getDateTimeString(item.publishedAt),
      createdAt: getDateTimeString(item.createdAt),
      updatedAt: getDateTimeString(item.updatedAt),
    };
  });
};

const AdminLivestreminagList = () => {
  const classes = useStyles();
  const { isFetching, videoList } = useSelector(videoListSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const getList = useCallback(() => {
    dispatch(videoListOperations.get());
  }, [dispatch]);

  useEffect(() => {
    getList();
  }, [getList]);

  const rows: Data[] = useMemo(() => getRows(videoList), [videoList]);

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
        <Table stickyHeader size="small" aria-label="admin-video-list">
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
              <VideoListTableRow data={row} columns={columns} key={row.id} />
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
  );
};

export default AdminLivestreminagList;
