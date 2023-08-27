import { memo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
}));

type Props = {
  handleSubmit: (tagName: string) => void;
};

const AdminTagForm = memo<Props>(({ handleSubmit }) => {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (input === '' || /\s+/g.test(input)) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [input]);

  const submit = () => {
    handleSubmit(input);
    setInput('');
  };

  return (
    <div className={classes.container}>
      <TextField
        // variant="outlined"
        placeholder="新しいタグを入力"
        size="small"
        fullWidth={true}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if ((e.charCode || e.keyCode) === 13 && input) {
            e.preventDefault();
          }
        }}
      />
      <Tooltip title="タグを新規作成">
        <span>
          <IconButton onClick={submit} disabled={isDisabled}>
            <PlaylistAddIcon
              color={isDisabled ? 'disabled' : 'primary'}
              style={{ fontSize: '28px' }}
            />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
});

export default AdminTagForm;
