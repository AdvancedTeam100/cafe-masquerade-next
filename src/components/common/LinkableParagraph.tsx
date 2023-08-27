import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@/config/ui';
import { Anchorme } from 'react-anchorme';

const useStyles = makeStyles(() => ({
  link: {
    color: colors.linkText,
  },
}));

type Props = {
  sentence: string;
} & DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

const LinkableParagraph = React.memo<Props>(({ sentence, ...props }) => {
  const classes = useStyles();
  return (
    <p {...props}>
      <Anchorme
        target="_blank"
        rel="noreferrer noopener"
        linkComponent={(props) => <a {...props} className={classes.link} />}
      >
        {sentence}
      </Anchorme>
    </p>
  );
});

export default LinkableParagraph;
