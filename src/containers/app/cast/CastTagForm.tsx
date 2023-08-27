import { memo, useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { CastTag } from '@/libs/models/castTag';
import { colors } from '@/config/ui';

const GreenCheckbox = withStyles({
  root: {
    '&$checked': {
      color: colors.lightGreen,
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    position: 'relative',
    background: colors.backgroundYellow,
    borderRadius: '12px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: '50%',
      marginLeft: '-10px',
      border: '10px solid transparent',
      borderTop: `10px solid ${colors.backgroundYellow}`,
    },
  },
  titleContainer: {
    padding: theme.spacing(2),
    backgroundColor: colors.backgroundBrown,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      borderRadius: '12px 12px 0 0',
      textAlign: 'center',
    },
    [theme.breakpoints.up('md')]: {
      width: '130px',
      borderRadius: '12px 0 0 12px',
      display: 'flex',
      alignItems: 'center',
    },
  },
  title: {
    color: 'white',
    fontWeight: 700,
  },
  mainContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 2),
    },
  },
  subTitle: {
    color: colors.brown,
    fontWeight: 700,
  },
  tagContainer: {
    width: '100%',
  },
  chackbox: {
    padding: '3px',
    [theme.breakpoints.down('sm')]: {
      padding: '4px',
    },
  },
  tagName: {
    color: colors.brown,
    fontSize: '14px',
  },
}));

type Props = {
  tags: CastTag[];
  onChange: (tags: string[]) => void;
};

const CastTagForm = memo<Props>(({ tags, onChange }) => {
  const isSm = useMediaQuery('(max-width: 960px)');
  const classes = useStyles();
  const [checkedTags, setCheckedTags] = useState<string[]>([]);

  useEffect(() => {
    onChange(checkedTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedTags]);

  const onClickTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tagName = event.target.name;
    if (event.target.checked) {
      setCheckedTags([...checkedTags, tagName]);
    } else {
      setCheckedTags(checkedTags.filter((tag) => tag !== tagName));
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <span className={classes.title}>
          {isSm ? 'お好みで女の子を検索' : '女の子を検索'}
        </span>
      </div>
      <div className={classes.mainContainer}>
        {!isSm && (
          <>
            <span
              className={classes.subTitle}
              style={{ wordBreak: 'keep-all' }}
            >
              {'お好みから探す'}
            </span>
            <span
              className={classes.subTitle}
              style={{ padding: '0 24px 0 16px' }}
            >
              {'〉'}
            </span>
          </>
        )}
        <div className={classes.tagContainer}>
          {tags.map((tag) => (
            <FormControlLabel
              key={`tag-form-${tag.name}`}
              control={
                <GreenCheckbox
                  checked={checkedTags.includes(tag.name)}
                  onChange={onClickTag}
                  name={tag.name}
                  size="medium"
                  className={classes.chackbox}
                />
              }
              label={tag.name}
              classes={{
                label: classes.tagName,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default CastTagForm;
