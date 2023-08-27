import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { colors } from '@/config/ui';
import { validationSchema } from '@/config/form/contact';
import { functions } from '@/libs/firebase';
import FormInput from '@/components/form/Input';
import FormActions from '@/components/form/Actions';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 4),
      padding: theme.spacing(2, 6),
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: theme.spacing(0, 2),
    },
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: '1rem',
    marginBottom: theme.spacing(0.5),
    color: colors.brown,
    fontWeight: 700,
    '& b': {
      color: colors.lightPink,
      fontSize: '1rem',
      margin: theme.spacing(0, 1),
    },
  },
  selectRoot: {
    '& fieldset': {
      borderColor: `${colors.lightGreen} !important`,
      borderWidth: '2px',
    },
  },
  selectInput: {
    color: colors.brown,
    margin: theme.spacing(0),
    padding: theme.spacing(1.8, 1),
    minWidth: '140px',
    fontSize: '14px',
    fontWeight: 500,
  },
  inputRoot: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: colors.lightGreen,
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: colors.lightGreen,
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.lightGreen,
      },
    },
    '& .MuiFormHelperText-root': {
      color: `${colors.brown} !important`,
      textAlign: 'right',
    },
  },
  input: {
    color: colors.brown,
    margin: theme.spacing(0),
    padding: theme.spacing(1.8, 1),
    fontSize: '14px',
    minWidth: '260px',
    fontWeight: 500,
  },
  textarea: {
    color: colors.brown,
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    fontSize: '14px',
    fontWeight: 500,
  },
  textareaInput: {
    padding: theme.spacing(1.8, 1),
  },
  formControl: {
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 0),
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
  },
  button: {
    margin: theme.spacing(1),
    borderRadius: '8px',
    backgroundColor: colors.brown,
    width: '120px',
    color: 'white',
    padding: theme.spacing(1, 1),
    '&:hover': {
      backgroundColor: colors.darkBrown,
    },
  },
}));

type Props = {
  onSend: () => void;
};

type FormData = {
  type: string;
  name: string;
  organization: string;
  email: string;
  phoneNumber: string;
  content: string;
};

const ContactForm: React.FC<Props> = ({ onSend }) => {
  const classes = useStyles();
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      type: 'おたより',
      name: '',
      organization: '',
      email: '',
      phoneNumber: '',
      content: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsSending(true);
    setErrorMessage('');
    try {
      const func = functions.httpsCallable('sendContact');
      await func(data);
      setIsSending(false);
      reset();
      onSend();
    } catch (e) {
      console.log(e);
      setErrorMessage('送信に失敗しました');
      setIsSending(false);
    }
  });

  return (
    <div className={classes.container}>
      <form onSubmit={onSubmit} className={classes.formContainer}>
        <div className={classes.formControl}>
          <InputLabel shrink className={classes.label}>
            お問い合わせの種類<b>＊</b>
          </InputLabel>
          <Select
            defaultValue={'おたより'}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              setValue('type', e.target.value as string);
            }}
            MenuProps={{ disableScrollLock: true }}
            displayEmpty
            className={classes.selectRoot}
            classes={{
              root: classes.selectInput,
            }}
            variant="outlined"
          >
            <MenuItem value={'おたより'}>おたより</MenuItem>
            <MenuItem value={'オンラインサロンに関するお問い合わせ'}>
              オンラインサロンに関するお問い合わせ
            </MenuItem>
            <MenuItem value={'販売作品およびグッズに関するお問い合わせ'}>
              販売作品およびグッズに関するお問い合わせ
            </MenuItem>
            <MenuItem value={'お仕事のご相談'}>お仕事のご相談</MenuItem>
            <MenuItem value={'ライツに関するご相談'}>
              ライツに関するご相談
            </MenuItem>
            <MenuItem value={'取材のご相談'}>取材のご相談</MenuItem>
            <MenuItem value={'その他'}>その他</MenuItem>
          </Select>
        </div>
        <div className={classes.formControl}>
          <InputLabel shrink className={classes.label}>
            お名前<b>＊</b>
          </InputLabel>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.name}
                placeholder="入力してください"
                variant="outlined"
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
            団体名など
          </InputLabel>
          <Controller
            name="organization"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.organization}
                placeholder="入力してください"
                fullWidth={true}
                variant="outlined"
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
            電話番号
          </InputLabel>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.phoneNumber}
                placeholder="090-1111-2222"
                fullWidth={true}
                variant="outlined"
                type="tel"
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
            お問い合わせ内容(1,000文字以内で入力してください)<b>＊</b>
          </InputLabel>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <FormInput
                field={field}
                fieldError={errors?.content}
                placeholder="入力してください"
                variant="outlined"
                fullWidth={true}
                multiline={true}
                rows={5}
                rowsMax={20}
                classes={{
                  root: classes.inputRoot,
                }}
                InputProps={{
                  classes: {
                    root: classes.textareaInput,
                    input: classes.textarea,
                  },
                }}
                helperText={`${field.value.length}/1000`}
              />
            )}
          />
        </div>
        {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
        <div className={classes.actionContainer}>
          <FormActions
            submitText="送信する"
            isDisabled={isSending}
            isLoading={isSending}
            submitButtonClass={classes.button}
          />
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
