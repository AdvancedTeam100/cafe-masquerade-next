import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import { storage } from '@/libs/firebase';
import {
  livestreamingMessageCollection,
  livestreamingMessageConverter,
} from '@/libs/firebase/firestore/livestreamingMessage';
import { LivestreamingMessage } from '@/libs/models/livestreamingMessage';
import { button, colors } from '@/config/ui';
import { validationSchema } from '@/config/form/livestreamingMessage';
import FormInput from '@/components/form/Input';
import Modal from '@/components/common/Modal';
import FormImageInput from '@/components/form/ImageInput';
import FormActions from '@/components/form/Actions';

const useStyles = makeStyles((theme) => ({
  closeButtonContainer: {},
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '550px',
    padding: theme.spacing(3, 3, 2),
    [theme.breakpoints.up('md')]: {
      width: '550px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
    },
    background: 'white',
  },
  formContainer: {
    width: '80%',
  },
  title: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: 700,
    color: colors.brown,
  },
  label: {
    fontSize: '1rem',
    color: colors.brown,
    opacity: '0.7',
  },
  input: {
    color: colors.brown,
    margin: theme.spacing(0),
  },
  inputUnderline: {
    '&::before': {
      borderBottom: `1px solid ${colors.brown}`,
    },
    '&::after': {
      borderBottom: `2px solid ${colors.brown}`,
    },
  },
  formControl: {
    padding: theme.spacing(2, 0),
  },
  errorMessage: {
    color: theme.palette.error.main,
    margin: theme.spacing(1, 0),
  },
  attention: {
    margin: theme.spacing(1, 0),
    color: colors.brown,
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: button.default,
  closeButton: button.gray,
}));

type Props = {
  livestreamingId: string;
  isOpened: boolean;
  onCreate: (userInfo: { name: string; avatarUrl: string }) => void;
  handleClose: () => void;
};

type FormData = {
  text: string;
  userName: string;
  avatar: File;
};

const LivestreamingChatCreateModal: React.FC<Props> = ({
  livestreamingId,
  isOpened,
  onCreate,
  handleClose,
}) => {
  const classes = useStyles();
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsCreating(true);
    setErrorMessage('');
    try {
      let avatarUrl = '';
      if (data.avatar) {
        const uploadTaskSnap = await storage
          .ref()
          .child(
            `livestreaming/${livestreamingId}/avatars/${new Date().getTime()}`,
          )
          .put(data.avatar);
        avatarUrl = await uploadTaskSnap.ref.getDownloadURL();
      }
      const docRef = livestreamingMessageCollection(livestreamingId).doc();
      const message: LivestreamingMessage = {
        id: docRef.id,
        text: data.text,
        user: {
          name: data.userName,
          avatarUrl,
        },
        createdAt: new Date().toISOString(),
      };
      await docRef.withConverter(livestreamingMessageConverter).set(message);
      setIsCreating(false);
      onCreate({ name: data.userName, avatarUrl });
      handleClose();
      reset();
    } catch (e) {
      console.log(e);
      setErrorMessage('送信に失敗しました');
      setIsCreating(false);
    }
  });

  return (
    <Modal
      ariaLabel="ls-chat-create-title"
      ariaDescription="ls-chat-create-description"
      isOpened={isOpened}
      onClose={handleClose}
      hasBorderRadius={true}
    >
      <div className={classes.container}>
        <h3 className={classes.title}>チャットを作成する</h3>
        <form onSubmit={onSubmit} className={classes.formContainer}>
          <div className={classes.formControl}>
            <Controller
              name="userName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormInput
                  field={field}
                  fieldError={errors?.userName}
                  placeholder="お名前を入力"
                  label=""
                  fullWidth={true}
                  InputProps={{
                    className: classes.input,
                    classes: {
                      underline: classes.inputUnderline,
                    },
                  }}
                />
              )}
            />
          </div>
          <div className={classes.formControl}>
            <Controller
              name="text"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormInput
                  field={field}
                  fieldError={errors?.text}
                  placeholder="メッセージを入力"
                  label=""
                  fullWidth={true}
                  InputProps={{
                    className: classes.input,
                    classes: {
                      underline: classes.inputUnderline,
                    },
                  }}
                />
              )}
            />
          </div>
          <div className={classes.formControl}>
            <span className={classes.label}>アイコンをアップロード</span>
            <FormImageInput
              componentKey="avatar-input"
              uploadButton={
                <IconButton size="small" component="span">
                  <AddCircleOutlinedIcon
                    style={{ color: colors.brown, fontSize: '48px' }}
                  />
                </IconButton>
              }
              previewWidth={90}
              previewHeight={90}
              onDropFile={(file) => setValue('avatar', file)}
              isPreviewCircle={true}
              previewObjectFit="cover"
            />
          </div>
          <p className={classes.attention}>
            ※このチャット機能はご主人様のクッキーを利用しております。
          </p>
          {errorMessage && (
            <p className={classes.errorMessage}>{errorMessage}</p>
          )}
          <div className={classes.actionContainer}>
            <FormActions
              submitText="送信"
              cancelText="閉じる"
              isDisabled={isCreating}
              isLoading={isCreating}
              handleCancel={handleClose}
              submitButtonClass={classes.button}
              cancelButtonClass={classes.closeButton}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default LivestreamingChatCreateModal;
