import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';
import { NewsTag } from '@/libs/models/newsTag';
import TagItem from '@/components/app/common/TagItem';

type Props = {
  newsTags: NewsTag[];
};

const useStyles = makeStyles((theme) => ({
  smTagListContainer: {
    margin: theme.spacing(3, 0, 2),
  },
  tagListTitle: {
    margin: theme.spacing(1, 2),
    color: colors.brown,
    fontWeight: 700,
  },
  smTagList: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    overflowX: 'auto',
    height: '40px',
    overflowY: 'hidden',
  },
  smTag: {
    wordBreak: 'keep-all',
    margin: '8px 2px',
    '& a': {
      padding: '8px 4px',
    },
  },
}));

const SmTagList = React.memo<Props>(({ newsTags }) => {
  const classes = useStyles();
  return (
    <div className={classes.smTagListContainer}>
      <p className={classes.tagListTitle}>タグで調べる</p>
      <div className={classes.smTagList}>
        {newsTags.map((tag) => (
          <div className={classes.smTag} key={`tags-${tag.name}`}>
            <TagItem
              title={tag.name}
              isOutlined={false}
              href={`/news/tags/${tag.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default SmTagList;
