import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import NoSsr from "@material-ui/core/NoSsr";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import StudentScreen from "./screens/StudentScreen";
import ProfessorsScreen from "./screens/ProfessorsScreen";
import GroupsScreen from "./screens/GroupsScreen";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

function LinkTab(props) {
  return (
    <Tab component="a" onClick={event => event.preventDefault()} {...props} />
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class App extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <NoSsr>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs fullWidth value={value} onChange={this.handleChange}>
              <LinkTab style = {{ fontSize: 20 }} label="Students" />
              <LinkTab style = {{ fontSize: 20 }} label="Professors"  />
              <LinkTab style = {{ fontSize: 20 }} label="Groups"  />
            </Tabs>
          </AppBar>
          {value === 0 && (
            <TabContainer>
              <StudentScreen />
            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer>
              <ProfessorsScreen />
            </TabContainer>
          )}
          {value === 2 && (
            <TabContainer>
              <GroupsScreen />
            </TabContainer>
          )}
        </div>
      </NoSsr>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
