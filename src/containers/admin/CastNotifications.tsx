import React, { FC, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { FormData } from '@/config/form/cast';
import FormInput from '@/components/form/Input';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
}));

type Props = {
  initialDiscordUrl?: string | null;
};

const AdminCastNotifications: FC<Props> = ({ initialDiscordUrl }) => {
  const classes = useStyles();
  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  useEffect(() => {
    if (initialDiscordUrl) {
      setValue('notificationDiscordUrl', initialDiscordUrl);
    }
  }, [initialDiscordUrl, setValue]);

  return (
    <div className={classes.root}>
      <Controller
        name="notificationDiscordUrl"
        control={control}
        render={({ field }) => (
          <FormInput
            field={field}
            multiline
            fieldError={errors?.notificationDiscordUrl}
            placeholder="通知用のDiscordのURLを入力"
            size="small"
            label="ライブ配信開始の通知（Discord）"
            fullWidth={true}
          />
        )}
      />
    </div>
  );
};

export default AdminCastNotifications;
