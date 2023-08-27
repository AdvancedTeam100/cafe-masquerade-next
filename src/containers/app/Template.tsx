import { useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import { APP_MAX_WIDTH } from '@/config/ui';
import { ContentSideLink } from '@/libs/models/content';
import SmDrawer from '@/components/app/templates/Drawer';
import Header from '@/components/app/templates/Header';
import BreadcrumbList, {
  Breadcrumb,
} from '@/components/app/templates/BreadcrumbList';
import Wrapper from '@/components/app/templates/Wrapper';
import SideBar from '@/components/app/templates/SideBar';
import Footer from '@/components/app/templates/Footer';

const HEADER_HEIGHT = 64;
const HEADER_HEIGHT_SM = 56;
const FOOTER_HEIGHT = 242;

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      margin: `${HEADER_HEIGHT_SM}px auto 0`,
      padding: theme.spacing(0, 1, 2),
    },
    [theme.breakpoints.up('md')]: {
      margin: `${HEADER_HEIGHT}px auto 0`,
      maxWidth: `${APP_MAX_WIDTH}px`,
      padding: theme.spacing(0, 2, 2),
    },
  },
}));

type Props = {
  hasSideBar: boolean;
  sideLinks: ContentSideLink[];
  breadcrumb: Breadcrumb;
  skipCheckAuth?: boolean;
  topContent?: React.ReactNode;
  additionalSideComponents?: Array<React.ReactNode | undefined>;
};

const AppTemplate: React.FC<Props> = ({
  children,
  hasSideBar,
  sideLinks,
  breadcrumb,
  skipCheckAuth,
  topContent,
  additionalSideComponents,
}) => {
  const classes = useStyles();
  const isSm = useMediaQuery('(max-width: 960px)');

  const [isSmDrawerOpened, setIsSmDrawerOpened] = useState(false);

  return (
    <>
      <Header
        onClickExpandIcon={() => setIsSmDrawerOpened(true)}
        skipCheckAuth={skipCheckAuth}
      />
      {isSm && (
        <Drawer
          anchor="right"
          open={isSmDrawerOpened}
          onClose={() => setIsSmDrawerOpened(false)}
        >
          <SmDrawer
            onCloseDrawer={() => setIsSmDrawerOpened(false)}
            sideLinks={sideLinks}
            skipCheckAuth={skipCheckAuth}
          />
        </Drawer>
      )}
      <Wrapper
        headerHeight={HEADER_HEIGHT}
        headerHeightSm={HEADER_HEIGHT_SM}
        footerHeight={FOOTER_HEIGHT}
      >
        <div className={classes.container}>
          {!isSm && <BreadcrumbList breadcrumb={breadcrumb} />}
          {topContent && topContent}
          <Grid container spacing={isSm ? 2 : 3}>
            <Grid item xs={12} sm={12} md={hasSideBar ? 9 : 12}>
              {children}
            </Grid>
            {hasSideBar && (
              <Grid item xs={12} sm={12} md={3}>
                <SideBar
                  sideLinks={sideLinks}
                  additionalSideComponents={additionalSideComponents}
                />
              </Grid>
            )}
          </Grid>
        </div>
      </Wrapper>
      <Footer additionalLinks={sideLinks} />
    </>
  );
};

export default AppTemplate;
