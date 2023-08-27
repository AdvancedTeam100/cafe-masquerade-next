import { memo } from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { colors } from '@/config/ui';
import { Column, Data } from '@/config/tableList/videoList';
import {
  VideoStatus,
  VideoUploadStatus,
  videoRequiredRoleToDisplayName,
  videoStatusToDisplayName,
  videoTypeToDisplayName,
} from '@/libs/models/video';
import RoleIcon from '../common/RoleIcon';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    alignItems: 'center',
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
    width: '112px',
    height: '63px',
  },
  thumbnailImage: {
    objectFit: 'contain',
  },
}));

const getStatusColor = (
  status: VideoStatus,
  uploadStatus?: VideoUploadStatus,
): string => {
  if (uploadStatus !== 'Transcoded') return colors.pink;
  switch (status) {
    case VideoStatus.Published:
      return colors.green;
    case VideoStatus.Limited:
      return colors.darkYellow;
    default:
      return colors.semiDarkGray;
  }
};

const TableCellContent = memo<{
  data: Data;
  column: Column;
}>(({ data, column }) => {
  const classes = useStyles();

  switch (column.id) {
    case 'title': {
      return (
        <Link href={'/admin/video/[id]'} as={`/admin/video/${data.id}`}>
          <a className={classes.cellLink}>{data.title}</a>
        </Link>
      );
    }
    case 'status': {
      const background = getStatusColor(data.status, data.uploadStatus);
      return (
        <div className={classes.flex}>
          <span className={classes.statusBadge} style={{ background }} />
          <span className={classes.statusText}>
            {data.uploadStatus === 'Transcoded'
              ? videoStatusToDisplayName[data.status]
              : '準備中'}
          </span>
        </div>
      );
    }
    case 'requiredRole': {
      const role = data.requiredRole;
      return (
        <div className={classes.flex}>
          {role && <RoleIcon role={role} />}
          <span style={{ margin: '0 8px 0 4px' }}>
            {role ? `${videoRequiredRoleToDisplayName[role]}` : '選択なし'}
            {role && role !== 'nonUser' && '以上'}
          </span>
        </div>
      );
    }
    case 'thumbnailUrl': {
      return (
        <div className={classes.thumnbailContainer}>
          {data.thumbnailUrl && (
            <img
              src={data.thumbnailUrl}
              alt={data.title}
              width={112}
              height={63}
              className={classes.thumbnailImage}
            />
          )}
        </div>
      );
    }
    case 'type': {
      return (
        <span className={classes.cellText}>
          {data.type ? videoTypeToDisplayName[data.type] : '選択なし'}
        </span>
      );
    }
    default:
      return <span className={classes.cellText}>{data[column.id]}</span>;
  }
});

const AdminVideoListTableRow = memo<{
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

export default AdminVideoListTableRow;
