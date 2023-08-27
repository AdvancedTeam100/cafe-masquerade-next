import { memo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TuneIcon from '@material-ui/icons/Tune';
import { buttonSquare, colors } from '@/config/ui';
import {
  VideoFilter,
  videoActions,
  videoOperations,
  videoSelectors,
} from '@/store/app/video';
import { ThunkDispatch } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { VideoType } from '@/libs/models/video';
import { Cast } from '@/libs/models/cast';
import FilterSelector from '@/components/app/video/FilterSelector';
import Modal from '@/components/common/Modal';

const GreenCheckbox = withStyles({
  root: {
    '&$checked': {
      color: colors.lightGreen,
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
  container: {},
  videoTypeContainer: {
    padding: theme.spacing(0, 3),
    background: colors.backgroundYellow,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
      background: 'initial',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
    },
  },
  videoTypeItem: {
    padding: theme.spacing(2, 2),
    fontWeight: 700,
    color: colors.brownText,
    cursor: 'pointer',
  },
  videoTypeItemSelected: {
    borderBottom: `2px solid ${colors.brown}`,
    cursor: 'initial',
    [theme.breakpoints.down('sm')]: {
      border: 'none',
      borderRadius: '24px',
      background: colors.backgroundYellow,
    },
  },
  selectorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: theme.spacing(1, 0),
  },
  checkbox: {
    padding: '3px',
    [theme.breakpoints.down('sm')]: {
      padding: '4px',
    },
  },
  checkText: {
    color: colors.brownText,
    fontWeight: 700,
  },
  smFilterButton: {
    width: '100%',
    borderRadius: '8px',
    background: colors.backgroundYellow,
    padding: theme.spacing(1.5, 0),
    textAlign: 'center',
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '16px',
    color: colors.brownText,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 'calc(100vw - 32px)',
    padding: theme.spacing(2),
    background: 'white',
  },
  modalSubTitle: {
    margin: theme.spacing(1, 0),
    fontSize: '1rem',
    fontWeight: 700,
    color: colors.brown,
    textAlign: 'left',
  },
  modalSection: {
    padding: theme.spacing(2, 1),
    borderBottom: `1px solid ${colors.border}`,
  },
  modalButtonContainer: {
    margin: '16px auto',
  },
  buttonPink: {
    ...buttonSquare.pink,
    width: '180px',
  },
}));

const getFilterFromQuery = (q: string): VideoFilter => {
  const getCastId = (c: string | null): VideoFilter['castId'] => {
    if (typeof c !== 'string') return '';
    return c;
  };
  const getDisplay = (d: string | null): VideoFilter['display'] => {
    switch (d) {
      case 'all':
      case 'available':
        return d;
      default:
        return 'all';
    }
  };
  const getVideoType = (t: string | null): VideoFilter['videoType'] => {
    switch (t) {
      case 'all':
      case VideoType.LiveAction:
      case VideoType.AfterTalk:
      case VideoType.Other:
        return t;
      default:
        return 'all';
    }
  };
  const getOrderBy = (o: string | null): VideoFilter['orderBy'] => {
    switch (o) {
      case 'desc':
      case 'asc':
        return o;
      default:
        return 'desc';
    }
  };
  const urlSearchParams = new URLSearchParams(q);
  return {
    castId: getCastId(urlSearchParams.get('c')),
    display: getDisplay(urlSearchParams.get('d')),
    videoType: getVideoType(urlSearchParams.get('t')),
    orderBy: getOrderBy(urlSearchParams.get('o')),
  };
};

const getQueryFromFilter = (filter: VideoFilter) =>
  `?c=${filter.castId}&d=${filter.display}&t=${filter.videoType}&o=${filter.orderBy}`;

const selectableTypes: {
  videoType: VideoFilter['videoType'];
  label: string;
}[] = [
  { videoType: 'all', label: '全て' },
  { videoType: 'LiveAction', label: '実写お給仕' },
  { videoType: 'AfterTalk', label: '限定トーク' },
  { videoType: 'Other', label: '無料コンテンツ' },
];

type Props = {
  casts: Cast[];
};

const VideoFilterForm = memo<Props>(({ casts }) => {
  const classes = useStyles();
  const router = useRouter();
  const isSm = useMediaQuery('(max-width: 960px)');
  const dispatch = useDispatch<ThunkDispatch>();
  const { filter } = useSelector(videoSelectors.state);
  const [lastQueryString, setLastQueryString] = useState<string>();
  const [isFilterModalOpened, setIsFilterModalOpened] = useState(false);

  useEffect(() => {
    const { asPath, pathname } = router;
    const query = asPath.replace(pathname, '');
    if (lastQueryString === query) return;
    dispatch(videoActions.resetListIds());
    dispatch(
      videoActions.updateFilter({
        filter: getFilterFromQuery(query),
      }),
    );
    setLastQueryString(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, lastQueryString]);

  const updateQuery = (params: Partial<VideoFilter>) => {
    router.push(getQueryFromFilter({ ...filter, ...params }), undefined, {
      scroll: false,
    });
    dispatch(videoActions.resetListIds());
  };

  useEffect(() => {
    if (lastQueryString === undefined) return;
    dispatch(videoOperations.getList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className={classes.container}>
      <div className={classes.videoTypeContainer}>
        {selectableTypes.map(({ videoType, label }) => (
          <div
            key={`type-${videoType}`}
            className={clsx(
              classes.videoTypeItem,
              filter.videoType === videoType && classes.videoTypeItemSelected,
            )}
            onClick={() => {
              if (filter.videoType === videoType) return;
              updateQuery({ videoType });
            }}
          >
            {label}
          </div>
        ))}
      </div>
      {isSm ? (
        <div
          className={classes.smFilterButton}
          onClick={() => setIsFilterModalOpened(true)}
        >
          その他のフィルター <TuneIcon />
        </div>
      ) : (
        <div className={classes.selectorContainer}>
          <div>
            <FilterSelector
              componentKey="cast-filter-selector"
              currentValue={filter.castId}
              buttonText={
                casts.find((cast) => cast.id === filter.castId)?.name ??
                'キャスト'
              }
              items={[
                { label: '選択なし', value: '' },
                ...casts.map((cast) => ({ label: cast.name, value: cast.id })),
              ]}
              onClickItem={(castId: string) => updateQuery({ castId })}
            />
            <FormControlLabel
              control={
                <GreenCheckbox
                  checked={filter.display === 'available'}
                  onChange={(e) =>
                    updateQuery({
                      display: e.target.checked ? 'available' : 'all',
                    })
                  }
                  size="medium"
                  className={classes.checkbox}
                />
              }
              label={'視聴可能な動画だけを表示'}
              classes={{
                label: classes.checkText,
              }}
              style={{ marginLeft: '8px' }}
            />
          </div>
          <div>
            <FilterSelector
              componentKey="orderBy-filter-selector"
              currentValue={filter.orderBy}
              buttonText={
                filter.orderBy === 'desc'
                  ? '追加日(新しい順)'
                  : '追加日(古い順)'
              }
              items={[
                { label: '追加日(新しい順)', value: 'desc' },
                { label: '追加日(古い順)', value: 'asc' },
              ]}
              onClickItem={(orderBy: string) =>
                updateQuery({ orderBy: orderBy as 'desc' | 'asc' })
              }
            />
          </div>
        </div>
      )}
      {isSm && (
        <Modal
          ariaLabel="ls-create-title"
          ariaDescription="ls-create-description"
          isOpened={isFilterModalOpened}
          onClose={() => setIsFilterModalOpened(false)}
          hasBorderRadius={true}
          hasBlur={true}
        >
          <div className={classes.modalContainer}>
            <div className={classes.modalSection}>
              <div className={classes.modalSubTitle}>キャスト</div>
              <FilterSelector
                componentKey="cast-filter-selector"
                currentValue={filter.castId}
                buttonText={
                  casts.find((cast) => cast.id === filter.castId)?.name ??
                  '選択なし'
                }
                items={[
                  { label: '選択なし', value: '' },
                  ...casts.map((cast) => ({
                    label: cast.name,
                    value: cast.id,
                  })),
                ]}
                onClickItem={(castId: string) => updateQuery({ castId })}
              />
            </div>
            <div className={classes.modalSection}>
              <div className={classes.modalSubTitle}>表示</div>
              <FilterSelector
                componentKey="display-filter-selector"
                currentValue={filter.display}
                buttonText={
                  filter.display === 'all'
                    ? '全て表示'
                    : '視聴可能な動画のみ表示'
                }
                items={[
                  { label: '全て表示', value: 'all' },
                  { label: '視聴可能な動画のみ表示', value: 'available' },
                ]}
                onClickItem={(display: string) =>
                  updateQuery({ display: display as 'all' | 'available' })
                }
              />
            </div>
            <div
              className={classes.modalSection}
              style={{ borderBottom: 'none' }}
            >
              <div className={classes.modalSubTitle}>並び替え</div>
              <FilterSelector
                componentKey="orderBy-filter-selector"
                currentValue={filter.orderBy}
                buttonText={
                  filter.orderBy === 'desc'
                    ? '追加日(新しい順)'
                    : '追加日(古い順)'
                }
                items={[
                  { label: '追加日(新しい順)', value: 'desc' },
                  { label: '追加日(古い順)', value: 'asc' },
                ]}
                onClickItem={(orderBy: string) =>
                  updateQuery({ orderBy: orderBy as 'desc' | 'asc' })
                }
              />
            </div>
            <div className={classes.modalButtonContainer}>
              <Button
                className={classes.buttonPink}
                variant="contained"
                color="primary"
                onClick={() => setIsFilterModalOpened(false)}
              >
                フィルター適用
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
});

export default VideoFilterForm;
