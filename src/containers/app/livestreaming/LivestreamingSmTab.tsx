import { ReactNode, useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { colors } from '@/config/ui';

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: '12px',
    width: '100%',
    height: '100%',
  },
  tabs: {
    borderBottom: `1px solid ${colors.border}`,
  },
  tabColor: {
    padding: theme.spacing(0, 2),
    color: `${colors.lightPink} !important`,
  },
  indicator: {
    backgroundColor: `${colors.lightPink} !important`,
  },
  tabContent: {
    height: 'calc(100% - 48px)',
    overflowY: 'auto',
    borderRadius: '12px',
    '-webkit-overflow-scrolling': 'touch',
  },
}));

type Props = {
  infoComponent: ReactNode;
  chatComponent: ReactNode;
};

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const LivestreamingSmTab: React.FC<Props> = ({
  infoComponent,
  chatComponent,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper className={classes.container} elevation={0}>
      <Tabs
        className={classes.tabs}
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        aria-label="icon tabs example"
        classes={{
          indicator: classes.indicator,
        }}
      >
        <Tab
          classes={{
            textColorPrimary: classes.tabColor,
            selected: classes.tabColor,
          }}
          icon={<InfoIcon style={{ color: colors.lightPink, fontSize: 24 }} />}
          aria-label="Info"
          {...a11yProps(0)}
        />
        <Tab
          classes={{
            textColorPrimary: classes.tabColor,
            selected: classes.tabColor,
          }}
          icon={
            <ChatBubbleIcon style={{ color: colors.lightPink, fontSize: 24 }} />
          }
          aria-label="Chat"
          {...a11yProps(1)}
        />
      </Tabs>
      <div
        role="tabpanel"
        hidden={value !== 0}
        id={`simple-tabpanel-${0}`}
        aria-labelledby={`simple-tab-${0}`}
        className={classes.tabContent}
      >
        {infoComponent}
      </div>
      <div
        role="tabpanel"
        hidden={value !== 1}
        id={`simple-tabpanel-${1}`}
        aria-labelledby={`simple-tab-${1}`}
        className={classes.tabContent}
      >
        {chatComponent}
      </div>
    </Paper>
  );
};

export default LivestreamingSmTab;
