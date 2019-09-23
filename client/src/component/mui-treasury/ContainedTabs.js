
  import React from 'react';
  import PropTypes from 'prop-types';
  import Color from 'color';
  import { makeStyles, ThemeProvider } from '@material-ui/styles';
  import Tabs from '@material-ui/core/Tabs';
  import Tab from '@material-ui/core/Tab';
  import {AppBar} from '@material-ui/core'
  import { green, lightGreen, red, grey } from '@material-ui/core/colors';
import { breakpoints } from '@material-ui/system';

  const useTabsStyles = makeStyles(() => ({
    indicator: {
      display: 'none',
    },
  }));
  
  const useTabStyles = makeStyles(theme => {
      
    const defaultBgColor = '#81c784';
    const defaultSelectedBgColor = '#4caf50';
    const defaultMinWidth = {
      xs: 120,
    };
    const getTextColor = color => {
      if (Color(color).isLight()) return theme.primary;
      return theme.white;
    };
    return {
      root: ({
        bgColor = defaultBgColor,
        minWidth = defaultMinWidth,
        selectedBgColor = defaultSelectedBgColor
      }) => ({
    
        minWidth: 40,
        opacity: 1,
        overflow: 'initial',
        color: grey[100],
        fontSize: 15,
        backgroundColor: bgColor,
        transition: '0.2s',
        '&:before': {
          transition: '0.2s',
        },
        '&:not(:first-of-type)': {
          '&:before': {
            content: '" "',
            position: 'absolute',
            left: 0,
            display: 'block',
            height: 20,
            width: 1,
            zIndex: 1,
            backgroundColor: "#9ccc65",
          },
        },
        '& + $selected:before': {
          opacity: 0,
        },
        '&:hover': {
          '&:not($selected)': {
            backgroundColor: "#66bb6a"
             
          },
          '&::before': {
            opacity: 0,
          },
          '& + $root:before': {
            opacity: 0,
          },
        },
      }),
      selected: ({ selectedBgColor = defaultSelectedBgColor }) => ({
        backgroundColor: selectedBgColor,
        borderStyle:'solid',
        border: 2,
        borderColor: green[500],
        color: grey[800],
        fontSize: 15,
        '& + $root:before': {
          opacity: 0,
        },
      }),
      wrapper: {
        zIndex: 2,
        textTransform: 'initial',
      },
    };
  });
  
  const ContainedTabs = ({ tabs, tabStyle, tabProps, ...props }) => {
    const tabsClasses = useTabsStyles(props);
    const tabClasses = useTabStyles({ ...tabProps, ...tabStyle });
    return (
    
      <Tabs variant="fullWidth" {...props} classes={tabsClasses}>
        {tabs.map(tab => (
          <Tab key={tab.label} {...tabProps} {...tab} classes={tabClasses} />
        ))}
      </Tabs>

    );
  };
  
  ContainedTabs.propTypes = {
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.node.isRequired,
      }),
    ),
    tabStyle: PropTypes.shape({
      bgColor: PropTypes.string,
      minWidth: PropTypes.shape({}),
    }),
    tabProps: PropTypes.shape({}),
  };
  ContainedTabs.defaultProps = {
    tabs: [],
    tabStyle: {},
    tabProps: {},
  };
  
  export default ContainedTabs;
