import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LockIcon from '@material-ui/icons/Lock';
import { buttonSquare, colors } from '@/config/ui';
import { FormData, validationSchema } from '@/config/form/authUser';
import FormInput from '@/components/form/Input';
import FormActions from '@/components/form/Actions';
import FormImageInput from '@/components/form/ImageInput';
import RoleIcon from '@/components/common/RoleIcon';
import {
  AuthUser,
  AuthUserParams,
  authOperations,
  authSelectors,
} from '@/store/auth';
import { ThunkDispatch } from '@/store';
import { sexLabel, userRoleToDisplayName } from '@/libs/models/user';
import { getDateList, getYearList } from '@/libs/utils/dateFormat';
import { zones } from '@/libs/utils/zone';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 0),
  },
  title: {
    fontWeight: 700,
    fontSize: '1.3rem',
    color: colors.brown,
    margin: theme.spacing(1, 0, 2),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 0, 2),
      fontSize: '1.2rem',
    },
  },
  formContainer: {
    width: '100%',
  },
  avatarContainer: {
    '& img': {
      borderRadius: '50%',
    },
  },
  label: {
    fontSize: '1rem',
    marginBottom: theme.spacing(0.5),
    color: colors.brown,
    fontWeight: 700,
    minWidth: '150px',
    '& b': {
      color: colors.lightPink,
      fontSize: '1rem',
      margin: theme.spacing(0, 1),
    },
  },
  subLabel: {
    marginLeft: '2px',
    marginRight: '4px',
    color: colors.brown,
  },
  defaultButtonRoot: {
    color: colors.brown,
  },
  defaultButtonOutlined: {
    border: `1px solid ${colors.brown}`,
  },
  selectRoot: {
    '& fieldset': {
      borderColor: `${colors.brown} !important`,
      borderWidth: '1px',
    },
  },
  selectInput: {
    color: colors.brown,
    margin: theme.spacing(0),
    padding: theme.spacing(1.3, 1),
    fontSize: '14px',
    fontWeight: 500,
  },
  inputRoot: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: colors.brown,
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: colors.brown,
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.brown,
      },
    },
  },
  input: {
    color: colors.brown,
    margin: theme.spacing(0),
    padding: theme.spacing(1.3, 1),
    fontSize: '14px',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      minWidth: '150px',
      width: '100%',
    },
  },
  radioGroup: {
    flexDirection: 'row',
  },
  radioLabel: {
    color: colors.brown,
    fontSize: 'inherit',
  },
  radioChecked: {
    color: `${colors.vividPink} !important`,
  },
  formControl: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px dashed ${colors.gray}`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: theme.spacing(2, 2),
    },
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  disabledText: {
    color: colors.brownText,
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
  },
  message: {
    margin: theme.spacing(2, 0, 1),
    color: colors.brownText,
    textAlign: 'center',
    '& a': {
      color: colors.linkText,
      textDecoration: 'underline',
    },
  },
  errorMessage: {
    color: theme.palette.error.main,
    margin: theme.spacing(1, 0),
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1, 5, 2),
    '& div': {
      width: '100%',
    },
  },
  submitButton: {
    ...buttonSquare.pink,
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  cancelButton: {
    ...buttonSquare.defaultOutlined,
    width: '100%',
    maxWidth: '300px',
    margin: '0 16px 0 0',
  },
}));

type Props = {
  user: AuthUser;
  isRegistration?: boolean;
  onSubmit: () => void;
};

const AuthUserForm: React.FC<Props> = ({
  user,
  isRegistration = false,
  onSubmit,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const [isSendable, setIsSendable] = useState(!isRegistration);
  const [errorMessage, setErrorMessage] = useState('');
  const { isUpdating } = useSelector(authSelectors.state);
  const dispatch = useDispatch<ThunkDispatch>();
  const defaultValue = useMemo(
    () => ({
      displayName: user.displayName,
      email: user.email,
      dateOfBirth: user.dateOfBirth
        ? {
            year: new Date(user.dateOfBirth).getFullYear(),
            month: new Date(user.dateOfBirth).getMonth() + 1,
            date: new Date(user.dateOfBirth).getDate(),
          }
        : {},
      sex: user.sex,
      prefecture: user.prefecture ?? '',
    }),
    [user],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: defaultValue,
  });
  const dateOfBirth = useWatch({ control, name: 'dateOfBirth' });

  useEffect(() => {
    reset(defaultValue);
  }, [user, reset, defaultValue, setValue]);

  const update = useCallback(
    (params: AuthUserParams) => {
      dispatch(
        authOperations.update(
          user,
          params,
          () => onSubmit(),
          (error: string) => {
            setErrorMessage(error);
          },
        ),
      );
    },
    [dispatch, user, onSubmit],
  );

  const onSubmitForm = handleSubmit(async (data) => {
    setErrorMessage('');
    const params: AuthUserParams = {
      ...data,
      dateOfBirth: dayjs(
        `${data.dateOfBirth.year}-${data.dateOfBirth.month}-${data.dateOfBirth.date}`,
      ).toISOString(),
    };
    update(params);
  });

  return (
    <Paper className={classes.container}>
      <h2 className={classes.title}>
        {isRegistration ? '会員情報入力' : 'アカウント設定'}
      </h2>
      <Divider />
      <form onSubmit={onSubmitForm} className={classes.formContainer}>
        <div className={clsx(classes.formControl, classes.avatarContainer)}>
          <InputLabel shrink className={classes.label}>
            プロフィールアイコン
          </InputLabel>
          <FormImageInput
            componentKey="image-input"
            previewWidth={40}
            previewHeight={40}
            previewObjectFit="cover"
            initialImageUrl={user?.avatarUrl ?? ''}
            showUploadButton={true}
            uploadButton={
              <Button
                variant="outlined"
                color="default"
                size="small"
                component="span"
                classes={{
                  root: classes.defaultButtonRoot,
                  outlined: classes.defaultButtonOutlined,
                }}
              >
                ファイルを選択
              </Button>
            }
            onDropFile={(file) => setValue('avatar', file)}
          />
        </div>
        <div className={classes.formControl}>
          <InputLabel shrink className={classes.label}>
            ユーザーネーム<b>＊</b>
          </InputLabel>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.displayName}
                placeholder="入力してください"
                variant="outlined"
                fullWidth
                classes={{
                  root: classes.inputRoot,
                }}
                InputProps={{
                  classes: {
                    input: classes.input,
                  },
                }}
              />
            )}
          />
        </div>
        <div className={classes.formControl}>
          <InputLabel shrink className={classes.label}>
            メールアドレス<b>＊</b>
          </InputLabel>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.email}
                placeholder="sample@xxx.co.jp"
                fullWidth={true}
                variant="outlined"
                type="email"
                classes={{
                  root: classes.inputRoot,
                }}
                InputProps={{
                  classes: {
                    input: classes.input,
                  },
                }}
              />
            )}
          />
        </div>
        <div className={classes.formControl}>
          <InputLabel shrink className={classes.label}>
            会員ステータス
          </InputLabel>
          <span className={classes.disabledText}>
            {userRoleToDisplayName[user.role]}
            <span style={{ margin: '0 4px', height: '14px' }}>
              <RoleIcon role={user.role} />
            </span>
            <LockIcon htmlColor={colors.semiDarkGray} fontSize="small" />
          </span>
        </div>
        <div className={classes.formControl}>
          <InputLabel shrink className={classes.label}>
            Discord ID
          </InputLabel>
          <span className={classes.disabledText}>
            {user.discordId}
            <LockIcon htmlColor={colors.semiDarkGray} fontSize="small" />
          </span>
        </div>
        <div className={classes.formControl}>
          <InputLabel shrink className={classes.label}>
            生年月日<b>＊</b>
          </InputLabel>
          <div className={classes.flex}>
            <Controller
              name="dateOfBirth.year"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    className={classes.selectRoot}
                    classes={{
                      root: classes.selectInput,
                    }}
                    style={{ width: '100px' }}
                    variant="outlined"
                  >
                    {getYearList().map((year) => (
                      <MenuItem key={`year-${year}`} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            />
            <span className={classes.subLabel}>年</span>
            <Controller
              name="dateOfBirth.month"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    className={classes.selectRoot}
                    classes={{
                      root: classes.selectInput,
                    }}
                    variant="outlined"
                  >
                    {[...Array(12).keys()].map((value) => {
                      const month = value + 1;
                      return (
                        <MenuItem key={`month-${month}`} value={month}>
                          {month}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </>
              )}
            />
            <span className={classes.subLabel}>月</span>
            <Controller
              name="dateOfBirth.date"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    className={classes.selectRoot}
                    classes={{
                      root: classes.selectInput,
                    }}
                    variant="outlined"
                  >
                    {getDateList(dateOfBirth?.year, dateOfBirth?.month).map(
                      (value) => {
                        return (
                          <MenuItem key={`date-${value}`} value={value}>
                            {value}
                          </MenuItem>
                        );
                      },
                    )}
                  </Select>
                </>
              )}
            />
            <span className={classes.subLabel}>日</span>
            {errors.dateOfBirth && (
              <p className={classes.errorMessage}>生年月日を入力してください</p>
            )}
          </div>
        </div>
        <div className={classes.formControl}>
          <Controller
            name="sex"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel shrink className={classes.label}>
                  性別
                </InputLabel>
                <RadioGroup
                  {...field}
                  classes={{
                    root: classes.radioGroup,
                  }}
                >
                  <FormControlLabel
                    value="male"
                    control={
                      <Radio classes={{ checked: classes.radioChecked }} />
                    }
                    label={sexLabel.male}
                    classes={{ label: classes.radioLabel }}
                  />
                  <FormControlLabel
                    value="female"
                    control={
                      <Radio classes={{ checked: classes.radioChecked }} />
                    }
                    label={sexLabel.female}
                    classes={{ label: classes.radioLabel }}
                  />
                  <FormControlLabel
                    value="other"
                    control={
                      <Radio classes={{ checked: classes.radioChecked }} />
                    }
                    label={sexLabel.other}
                    classes={{ label: classes.radioLabel }}
                  />
                </RadioGroup>
              </>
            )}
          />
        </div>
        <div className={classes.formControl}>
          <Controller
            name="prefecture"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel shrink className={classes.label}>
                  都道府県
                </InputLabel>
                <Select
                  {...field}
                  className={classes.selectRoot}
                  classes={{
                    root: classes.selectInput,
                  }}
                  style={{ width: '100px' }}
                  variant="outlined"
                >
                  {zones.map((prefecture) => (
                    <MenuItem key={prefecture.name} value={prefecture.name}>
                      {prefecture.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          />
        </div>
        {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
        {isRegistration && (
          <p className={classes.message}>
            <Checkbox
              checked={isSendable}
              onChange={() => setIsSendable(!isSendable)}
            />
            <a href="/terms" target="_blank">
              利用規約
            </a>
            と
            <a href="/policy" target="_blank">
              プライバシーポリシー
            </a>
            に同意する
          </p>
        )}
        <div className={classes.actionContainer}>
          <FormActions
            submitText={isRegistration ? 'アカウントを作成' : '変更を保存'}
            isDisabled={!isSendable || isUpdating}
            isLoading={isUpdating}
            submitButtonClass={classes.submitButton}
            cancelButtonClass={classes.cancelButton}
            handleCancel={isRegistration ? undefined : () => router.back()}
            cancelText="キャンセル"
          />
        </div>
      </form>
    </Paper>
  );
};

export default AuthUserForm;
