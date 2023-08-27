import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ListItemText from '@material-ui/core/ListItemText';
import { colors } from '@/config/ui';

const useStyles = makeStyles(() => ({
  container: {
    width: '90%',
  },
  listItem: {
    paddingLeft: '0',
  },
  listItemIcon: {
    minWidth: '24px',
  },
}));

type Props = {
  tagName: string;
  handleAdd: (tagName: string) => void;
  handleDelete: (tagName: string) => void;
};

const AdminTagListItem = memo<Props>(({ tagName, handleAdd, handleDelete }) => {
  const classes = useStyles();
  return (
    <ListItem
      classes={{ container: classes.container, root: classes.listItem }}
    >
      <ListItemIcon classes={{ root: classes.listItemIcon }}>
        <Tooltip title="追加">
          <IconButton
            edge="start"
            aria-label="add"
            size="small"
            onClick={() => handleAdd(tagName)}
          >
            <AddOutlinedIcon htmlColor={colors.pink} />
          </IconButton>
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary={tagName} />
      <ListItemSecondaryAction>
        <Tooltip title="削除">
          <IconButton
            edge="end"
            aria-label="delete"
            size="small"
            onClick={() => handleDelete(tagName)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
});

export default AdminTagListItem;
