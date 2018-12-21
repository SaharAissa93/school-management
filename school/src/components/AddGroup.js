import React, { Component } from "react";
import { ButtonToolbar, Button } from "react-bootstrap";

class AddGroup extends Component {
  constructor(props) {
    super(props);
    this.state = { groupList: [] };
    this.props.funcDataGroups();
  }

  GroupSubmit(event) {
    console.log("group submit");
    event.preventDefault();
    let GroupId = this.refs.GroupId.value;
    let groupName = this.refs.groupName.value;
    let studentCapacity = this.refs.studentCapacity.value;
    let professorCapacity = this.refs.professorCapacity.value;

    fetch("http://localhost:8080/groups", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        GroupId,
        groupName,
        studentCapacity,
        professorCapacity
      })
    }).then(data => {
      this.props.funcDataGroups();
    });
    this.props.onClick();

    this.setState({ show: true });
  }

  render() {
    return (
      <div>
        <h3>Create New Group</h3>
        <form
          ref="myForm"
          className="myForm"
          onSubmit={this.GroupSubmit.bind(this)}
        >
          <div className="form-group row">
            <label className=" control-label col-md-12"><h4>Group Number</h4></label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="GroupId"
                placeholder="Group Number"
                defaultValue={this.state.groupList.GroupId}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label className=" control-label col-md-12"><h4>Group Name</h4></label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="groupName"
                placeholder="Group Name"
                defaultValue={this.state.groupList.groupName}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-12"><h4>Student Capacity</h4></label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="studentCapacity"
                placeholder="Student Capacity"
                defaultValue={this.state.groupList.studentCapacity}
                required
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="control-label col-md-12">
             <h4> Professor Capacity</h4>
            </label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="professorCapacity"
                placeholder="Professor Capacity"
                defaultValue={this.state.groupList.professorCapacity}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <ButtonToolbar>
              <Button bsStyle="primary" type="submit">
                Save
              </Button>
              <Button bsStyle="default" onClick={this.props.onClick}>
                Cancel
              </Button>
            </ButtonToolbar>
          </div>
        </form>
      </div>
    );
  }
}
export default AddGroup;
