import { FC } from 'react';
import { ContentBlock, ContentState } from 'react-draft-wysiwyg';

export const blockRenderer = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();

  // Convert image type to mediaComponent
  if (type === 'atomic') {
    return {
      component: MediaComponent,
      editable: false,
    };
  }
};

type Props = {
  contentState: ContentState;
  block: ContentBlock;
};

const MediaComponent: FC<Props> = (props) => {
  const { contentState, block } = props;
  const data = contentState.getEntity(block.getEntityAt(0)).getData();

  const emptyHtml = ' ';
  return (
    <div>
      {emptyHtml}
      <img
        src={data.src}
        alt={data.alt || ''}
        style={{ height: data.height || 'auto', width: data.width || 'auto' }}
      />
    </div>
  );
};
