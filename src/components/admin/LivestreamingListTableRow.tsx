import { memo } from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { colors } from '@/config/ui';
import { Column, Data } from '@/config/tableList/livestreamingList';
import { LivestreamingStatus } from '@/libs/models/livestreaming';

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
    background: 'black',
    width: '160px',
    height: '90px',
  },
  thumbnailImage: {
    objectFit: 'contain',
  },
}));

const TableCellContent = memo<{
  data: Data;
  column: Column;
}>(({ data, column }) => {
  const classes = useStyles();

  switch (column.id) {
    case 'title': {
      return (
        <Link
          href={'/admin/livestreaming/[id]'}
          as={`/admin/livestreaming/${data.id}`}
        >
          <a className={classes.cellLink}>{data.title}</a>
        </Link>
      );
    }
    case 'status': {
      const isStreaming = data.status === LivestreamingStatus.Streaming;
      return (
        <div className={classes.flex}>
          <span
            className={classes.statusBadge}
            style={{
              background: isStreaming ? colors.green : colors.semiDarkGray,
            }}
          />
          <span className={classes.statusText}>
            {isStreaming
              ? '配信中'
              : data.status === LivestreamingStatus.Scheduled
              ? '配信予定'
              : '配信終了'}
          </span>
        </div>
      );
    }
    case 'thumbnailUrl': {
      return (
        <div className={classes.thumnbailContainer}>
          <img
            src={data.thumbnailUrl}
            alt={data.title}
            width={160}
            height={90}
            className={classes.thumbnailImage}
          />
        </div>
      );
    }
    default:
      return <span className={classes.cellText}>{data[column.id]}</span>;
  }
});

const AdminLivestreamingListTableRow = memo<{
  data: Data;
  columns: Column[];
}>(({ data, columns }) => {
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
          <TableCellContent data={data} column={column} />
        </TableCell>
      ))}
    </TableRow>
  );
});

export default AdminLivestreamingListTableRow;
