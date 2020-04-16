import React, { useContext } from 'react';
import { Link, withRouter }  from 'react-router-dom';
import { LayoutContext } from '../../context/layout.context';
import clsx from 'clsx';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';


import UserService from '../../services/user.service';

import Sidebar from './Sidebar';
import AppNavbar from './AppNavbar';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    minHeight: '100vh'
  },
}));


const MainLayout = (props) => {

    const classes = useStyles();
    const layoutContext = useContext(LayoutContext)
    const { openSidebar, setOpenSidebar } = layoutContext;
  
   
    return (
        <div className={classes.root}>
          <CssBaseline />
          <AppNavbar
             openSidebar={openSidebar} 
             handleSidebarOpen={() => setOpenSidebar(true)}
          />
          <Sidebar
            openSidebar={openSidebar} 
            handleSidebarClose={() => setOpenSidebar(false)}
          />
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: openSidebar,
            })}
          >
            <div className={classes.drawerHeader} />
           
            {props.children}
          </main>
        </div>
      );
};





export default withRouter(MainLayout);
