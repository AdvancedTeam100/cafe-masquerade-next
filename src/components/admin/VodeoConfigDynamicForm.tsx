import { memo, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import RoleIcon from '@/components/common/RoleIcon';
import {
  Video,
  VideoRequiredRole,
  VideoType,
  getAllowedRoles,
  selectableVideoRequiredRoles,
  videoRequiredRoleToDisplayName,
  videoTypeToDisplayName,
  videoTypes,
} from '@/libs/models/video';
import { getEndOfNextWeekDate, getISOString } from '@/libs/utils/dateFormat';

const useStyles = makeStyles((theme) => ({
  formControl: {
    padding: theme.spacing(1.5, 1, 1.5, 0),
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  errorMessage: {
    color: theme.palette.error.main,
    margin: theme.spacing(1, 0),
  },
}));

export type DynamicValues = {
  type: VideoType | undefined | null;
  requiredRole: VideoRequiredRole | undefined | null;
  expiredAt: Video['expiredAt'];
};

type Props = {
  publishedAt: string | undefined;
  initialValues: DynamicValues;
  onChangeValue: ({ type, requiredRole, expiredAt }: DynamicValues) => void;
  errors?: {
    type?: string;
    requiredRole?: string;
    expiredAt?: string;
  };
  isEntirelyDisabled?: boolean;
};

const getExipiredAt = (
  expiredAt: Video['expiredAt'],
  requiredRole: VideoRequiredRole | undefined | null,
): DynamicValues['expiredAt'] => {
  if (requiredRole === undefined || requiredRole === null) return {};

  if (!expiredAt) return null;

  const allowedRoles = getAllowedRoles(requiredRole);
  return allowedRoles.reduce(
    (acc, key) => ({ ...acc, [key]: expiredAt[key] ?? '' }),
    {},
  );
};

const VideoConfigDynamicForm = memo<Props>(
  ({
    publishedAt,
    initialValues,
    onChangeValue,
    errors,
    isEntirelyDisabled,
  }) => {
    const classes = useStyles();
    const [type, setType] = useState<DynamicValues['type']>(initialValues.type);
    const [requiredRole, setRequiredRole] = useState<
      DynamicValues['requiredRole']
    >(initialValues.requiredRole);
    const [expiredAt, setExpiredAt] = useState<DynamicValues['expiredAt']>(
      getExipiredAt(initialValues.expiredAt, initialValues.requiredRole), // 表示順序がランダムになるので整える
    );

    useEffect(() => {
      const values = {
        type,
        requiredRole,
        expiredAt,
      };
      onChangeValue(values);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, requiredRole, expiredAt]);

    const expiredAtEntries = expiredAt
      ? (Object.entries(expiredAt) as [VideoRequiredRole, string][])
      : [];

    const onChangeType = (e: React.ChangeEvent<{ value: unknown }>) => {
      const value = e.target.value as VideoType;
      setType(value);

      const endOfNextWeek = getISOString(
        getEndOfNextWeekDate(publishedAt ?? new Date()),
      );
      switch (value) {
        case VideoType.LiveAction: {
          setRequiredRole('gold');
          setExpiredAt({
            diamond: '',
            platinum: '',
            gold: endOfNextWeek,
          });
          break;
        }
        case VideoType.AfterTalk: {
          setRequiredRole('silver');
          setExpiredAt({
            diamond: '',
            platinum: '',
            gold: endOfNextWeek,
            silver: endOfNextWeek,
          });
          break;
        }
        default:
          break;
      }
    };

    const onChangeRequiredRole = (e: React.ChangeEvent<{ value: unknown }>) => {
      const value = e.target.value as VideoRequiredRole;
      setRequiredRole(value);

      const allowedRoles = getAllowedRoles(value);
      const changedExpiredAt = allowedRoles.reduce(
        (acc, key) => ({ ...acc, [key]: expiredAt?.[key] ?? '' }),
        {} as Video['expiredAt'],
      );
      setExpiredAt(changedExpiredAt);
    };

    const onChangeExpiredAt = (
      e: React.ChangeEvent<{ value: unknown; name?: string }>,
    ) => {
      const key = e.target.name as keyof Video['expiredAt'];
      const value = e.target.value as string;
      setExpiredAt({
        ...expiredAt,
        [key]: value,
      });
    };

    return (
      <>
        <Grid item sm={12} xs={12}>
          <div className={classes.formControl}>
            <InputLabel shrink>動画の種類</InputLabel>
            <Select
              variant="outlined"
              displayEmpty
              style={{ minWidth: '120px' }}
              onChange={onChangeType}
              value={type ?? ''}
              disabled={isEntirelyDisabled}
            >
              <MenuItem value="" disabled>
                動画の種類を選択してください
              </MenuItem>
              {videoTypes.map((type) => (
                <MenuItem value={type} key={`type-input-${type}`}>
                  {videoTypeToDisplayName[type]}
                </MenuItem>
              ))}
            </Select>
            {errors?.type && (
              <p className={classes.errorMessage}>{errors?.type}</p>
            )}
          </div>
        </Grid>
        <Grid item sm={12} xs={12}>
          <div className={classes.formControl}>
            <InputLabel shrink>公開範囲</InputLabel>
            <Select
              variant="outlined"
              displayEmpty
              style={{ minWidth: '120px' }}
              onChange={onChangeRequiredRole}
              value={requiredRole ?? ''}
              disabled={isEntirelyDisabled}
            >
              <MenuItem value="" disabled>
                公開範囲を選択してください
              </MenuItem>
              {selectableVideoRequiredRoles.map((requiredRole) => (
                <MenuItem
                  value={requiredRole}
                  key={`requiredRole-input-${requiredRole}`}
                >
                  <span className={classes.flex}>
                    <RoleIcon role={requiredRole} />
                    <span style={{ marginLeft: '4px' }}>
                      {videoRequiredRoleToDisplayName[requiredRole]}
                      {requiredRole !== 'nonUser' && '以上'}
                    </span>
                  </span>
                </MenuItem>
              ))}
            </Select>
            {errors?.requiredRole && (
              <p className={classes.errorMessage}>{errors?.requiredRole}</p>
            )}
          </div>
        </Grid>
        {expiredAtEntries.length > 0 && (
          <Grid item sm={12} xs={12}>
            <div className={classes.formControl}>
              <InputLabel shrink>視聴期限（空欄の場合は無期限）</InputLabel>
              {expiredAtEntries.map(([role, value]) => (
                <div
                  className={classes.flex}
                  style={{ margin: '8px 4px' }}
                  key={`expiredAt-input-${role}`}
                >
                  <div className={classes.flex} style={{ width: '160px' }}>
                    <RoleIcon role={role as VideoRequiredRole} />
                    <span style={{ marginLeft: '4px' }}>
                      {
                        videoRequiredRoleToDisplayName[
                          role as VideoRequiredRole
                        ]
                      }
                    </span>
                  </div>
                  <TextField
                    name={role}
                    variant="outlined"
                    size="small"
                    type="datetime-local"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={value || ''}
                    onChange={onChangeExpiredAt}
                    disabled={isEntirelyDisabled}
                  />
                </div>
              ))}
              {errors?.expiredAt && (
                <p className={classes.errorMessage}>{errors?.expiredAt}</p>
              )}
            </div>
          </Grid>
        )}
      </>
    );
  },
);

export default VideoConfigDynamicForm;
