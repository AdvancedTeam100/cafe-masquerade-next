import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import { FormData } from '@/config/form/cast';
import { ThunkDispatch } from '@/store';
import {
  castTagListOperations,
  castTagListSelectors,
} from '@/store/admin/castTagList';
import TagForm from '@/components/admin/TagForm';
import TagListItem from '@/components/admin/TagListItem';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  chipList: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(2, 0),
  },
  chip: {
    margin: '2px',
  },
  listContainer: {
    height: '280px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0, 0, 0, .1)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 50, .5)',
      boxShadow: '0 0 0 1px rgba(255, 255, 255, .3)',
    },
  },
}));

type Props = {
  initialTags: string[];
};

const AdminCastTagList: FC<Props> = ({ initialTags }) => {
  const classes = useStyles();
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  const { isFetching, isCreating, isDeleting, castTags } = useSelector(
    castTagListSelectors.state,
  );
  const dispatch = useDispatch<ThunkDispatch>();
  const { setValue } = useFormContext<FormData>();

  const getList = useCallback(() => {
    dispatch(castTagListOperations.get());
  }, [dispatch]);

  const addTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const removeTag = (tagName: string) =>
    setSelectedTags(selectedTags.filter((tag) => tag !== tagName));

  useEffect(() => {
    setValue('tags', selectedTags);
  }, [selectedTags, setValue]);

  const createTag = useCallback(
    (castTagName: string) => {
      dispatch(castTagListOperations.create(castTagName));
    },
    [dispatch],
  );

  const deleteTag = useCallback(
    (castTagName: string) => {
      if (
        confirm(
          'タグを削除すると関連するキャストのタグも削除されます。\n 削除しますか？',
        )
      ) {
        dispatch(castTagListOperations.deleteTag(castTagName));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <div className={classes.root}>
      <div className={classes.chipList}>
        {selectedTags.map((tagName) => (
          <Chip
            size="small"
            icon={<LocalOfferOutlinedIcon />}
            label={tagName}
            onDelete={() => removeTag(tagName)}
            key={`selected-tag-${tagName}`}
            className={classes.chip}
          />
        ))}
      </div>
      <TagForm handleSubmit={createTag} />
      <List dense={true} className={classes.listContainer}>
        {(isFetching || isCreating || isDeleting) && <LinearProgress />}
        {castTags
          .slice()
          .reverse()
          .map((tag) =>
            selectedTags.includes(tag.name) ? (
              <span key={`tag-${tag.name}`} />
            ) : (
              <TagListItem
                key={`tag-${tag.name}`}
                tagName={tag.name}
                handleAdd={addTag}
                handleDelete={deleteTag}
              />
            ),
          )}
      </List>
    </div>
  );
};

export default AdminCastTagList;
