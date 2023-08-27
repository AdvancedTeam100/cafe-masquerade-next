import { memo, useCallback } from 'react';
import {
  Controller,
  FieldArrayWithId,
  UseFormSetValue,
  useFormContext,
} from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import CloseIcon from '@material-ui/icons/Close';
import { FormData } from '@/config/form/homeContent';
import FormInput from '@/components/form/Input';
import FormImageInput from '@/components/form/ImageInput';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { HomeContentParams } from '@/store/admin/homeContent';

const useStyles = makeStyles((theme) => ({
  nestedInput: {
    marginBottom: theme.spacing(1),
  },
  flexStart: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  imagesInner: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
  },
}));

type Props = {
  removeTopImage: (index?: number | number[] | undefined) => void;
  setValue: UseFormSetValue<HomeContentParams>;
  topImages: HomeContentParams['topImages'];
  topImageFields: FieldArrayWithId<HomeContentParams, 'topImages', 'id'>[];
};

const HomeContentDraggableImagesForm = memo<Props>(
  ({ removeTopImage, setValue, topImages, topImageFields }) => {
    const classes = useStyles();
    const {
      control,
      formState: { errors },
    } = useFormContext<FormData>();

    const onDragEnd = useCallback(
      (result: DropResult) => {
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination?.index;

        if (destinationIndex === undefined) return;

        const newImages = topImageFields.slice();
        const dest = newImages[destinationIndex];
        const sour = newImages[sourceIndex];

        if (dest === undefined || sour === undefined) return;

        newImages.splice(sourceIndex, 1);
        newImages.splice(destinationIndex, 0, sour);

        setValue('topImages', newImages);
      },
      [setValue, topImageFields],
    );

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="home-top-images" direction="vertical">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={classes.flexStart}
            >
              {topImageFields.map((item, i) => (
                <Draggable key={item.href} draggableId={item.id} index={i}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className={classes.imagesInner}>
                        <DragHandleIcon />
                        <FormImageInput
                          componentKey={`topImages-input-${i}`}
                          previewWidth={200}
                          previewHeight={112}
                          previewObjectFit="cover"
                          initialImageUrl={'url' in item ? item.url : ''}
                          initialFile={'size' in item ? item : null}
                          uploadButton={
                            <Button
                              variant="outlined"
                              color="default"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                              style={{ marginTop: '8px' }}
                            >
                              画像{i + 1}
                            </Button>
                          }
                          onDropFile={(file) => {
                            const newImages = topImages;
                            newImages.splice(i, 1, {
                              file: file,
                              href: newImages[i]?.href ?? '',
                            });
                            setValue('topImages', newImages);
                          }}
                        />
                        <Controller
                          name={
                            `topImages.${i}.href` as `topImages.${number}.href`
                          }
                          control={control}
                          defaultValue={item.href}
                          render={({ field }) => (
                            <FormInput
                              field={field}
                              label="リンク先URL"
                              placeholder={'リンク先URLを入力'}
                              fieldError={
                                errors?.topImages?.length
                                  ? errors?.topImages[i]?.href
                                  : undefined
                              }
                              className={classes.nestedInput}
                            />
                          )}
                        />
                        {topImageFields.length > 1 && (
                          <Tooltip title="削除">
                            <IconButton
                              onClick={() => removeTopImage(i)}
                              size="small"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  },
);

export default HomeContentDraggableImagesForm;
