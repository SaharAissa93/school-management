import React, { Component } from "react";
import { ButtonToolbar, Button } from "react-bootstrap";

class AddStudent extends Component {
  constructor(props) {
    super(props);
    this.state = { title: "", studentList: [], groupList: [] };

    if (this.props.studentId > 0) {
      fetch("http://localhost:8080/students/" + this.props.studentId)
        .then(response => response.json())
        .then(data => {
          this.setState({ title: "Edit Student", studentList: data });
        });
    } else {
      //dropdown list remplie avec les GroupId des groups ajoutées
      fetch("http://localhost:8080/groups")
        .then(response => response.json())
        .then(data => {
          this.setState({ title: "Create New Student", groupList: data });
        });
    }
    this.props.updateStudents();
  }

  StudentSubmit(event) {
    if (this.state.studentList.id) {
      event.preventDefault();
      let studentName = this.refs.studentName.value;
      let studentAge = this.refs.studentAge.value;
      let GroupId = this.state.studentList.id;
      fetch("http://localhost:8080/students/" + this.state.studentList.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ GroupId, studentName, studentAge })
      })
        .then(response => response.json())
        .then(data => {
          this.props.updateStudents();
        });
      this.props.onClickClose();
    } else {
      event.preventDefault();
      let studentName = this.refs.studentName.value;
      let studentAge = this.refs.studentAge.value;
      let GroupId = this.refs.GroupId.value;

      fetch("http://localhost:8080/students", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ GroupId, studentName, studentAge })
      })
        .then(response => response.json())
        .then(data => {
          this.props.updateStudents();
        });

      this.refs.myForm.reset();
      this.props.onClickClose();
    }
  }
  renderCreateFormStudent(groupNumbers: Group[]) {
    groupNumbers = this.props.groupNumbers;
    let createOrEditFormSelect;
    if (this.props.studentId > 0) {
      createOrEditFormSelect = (
        <div className="form-group row">
          <div className="col-md-4">
            <select disabled ref="GroupId" name="numbers">
              {groupNumbers.map(groupNumber => (
                <option defaultValue={this.state.studentList.GroupId}>
                  {this.state.studentList.GroupId}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    } else {
      createOrEditFormSelect = (
        <div className="form-group row">
          <div className="col-md-4">
            <select ref="GroupId" name="numbers">
              <option value="">Select</option>

              {groupNumbers.map(groupNumber => (
                <option defaultValue={groupNumber.GroupId}>
                  {groupNumber.GroupId}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }
    return (
      <div>
        <h1>{this.state.title}</h1>
        <form
          ref="myForm"
          className="myForm"
          onSubmit={this.StudentSubmit.bind(this)}
        >
          <div className="form-group row">
            <label className=" control-label col-md-12">Student Name</label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="studentName"
                placeholder="Student Name"
                defaultValue={this.state.studentList.studentName}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-12">Student Age</label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="studentAge"
                placeholder="Student Age"
                defaultValue={this.state.studentList.studentAge}
                required
              />
            </div>
          </div>
          {createOrEditFormSelect}
          <ButtonToolbar>
            <Button type="submit" className="btn btn-primary">
              {this.props.text}
            </Button>

            <Button
              onClick={this.props.onClickClose}
              className="btn btn-default"
            >
              Close
            </Button>
          </ButtonToolbar>
        </form>
      </div>
    );
  }
  render() {
    let createFormStudent = this.renderCreateFormStudent(
      this.state.groupNumbers
    );
    return <div>{createFormStudent}</div>;
  }
}
export default AddStudent;
