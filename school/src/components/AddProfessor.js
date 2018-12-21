import React, { Component } from "react";
import { ButtonToolbar, Button } from "react-bootstrap";

class AddProfessor extends Component {
  constructor(props) {
    super(props);
    this.state = { title: "", professorList: [], groupNumbers: [] };
    if (this.props.professorId > 0) {
      fetch("http://localhost:8080/professors/" + this.props.professorId)
        .then(response => response.json())
        .then(data => {
          this.setState({ title: "Edit Professor", professorList: data });
        });
    } else {
      this.state = { title: "Create New Professor", professorList: [] };
    }

    this.props.updateProfessors();
  }

  ProfessorSubmit(event) {
    if (this.state.professorList.id) {
      event.preventDefault();
      let professorName = this.refs.professorName.value;
      let professorAge = this.refs.professorAge.value;
      let GroupId = this.state.professorList.id;
      fetch("http://localhost:8080/professors/" + this.state.professorList.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ GroupId, professorName, professorAge })
      })
        .then(response => response.json())
        .then(data => {
          this.props.updateProfessors();
        });
    } else {
      event.preventDefault();
      let professorName = this.refs.professorName.value;
      let professorAge = this.refs.professorAge.value;
      let GroupId = this.refs.GroupId.value;

      fetch("http://localhost:8080/professors", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ GroupId, professorName, professorAge })
      })
        .then(response => response.json())
        .then(data => {
          this.props.updateProfessors();
        });
      this.refs.myForm.reset();
    }
  }
  renderCreateForm(groupNumbers: Group[]) {
    groupNumbers = this.props.groupNumbers;
    let createOrEditFormSelect;
    if (this.props.professorId > 0) {
      createOrEditFormSelect = (
        <div className="form-group row">
          <div className="col-md-4">
            <select disabled ref="GroupId" name="numbers">
              {groupNumbers.map(groupNumber => (
                <option defaultValue={this.state.professorList.GroupId}>
                  {this.state.professorList.GroupId}
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
          onSubmit={this.ProfessorSubmit.bind(this)}
        >
          <div className="form-group row">
            <label className=" control-label col-md-12">Professor Name</label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="professorName"
                placeholder="Professor Name"
                defaultValue={this.state.professorList.professorName}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-12">Professor Age</label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="professorAge"
                placeholder="Professor Age"
                defaultValue={this.state.professorList.professorAge}
                required
              />
            </div>
          </div>
          {createOrEditFormSelect}
          <ButtonToolbar>
            <Button
              type="submit"
              onClick={this.props.onClick}
              className="btn btn-primary"
            >
              Save Professor
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
    let createForm = this.renderCreateForm(this.state.groupNumbers);
    return <div>{createForm}</div>;
  }
}
export default AddProfessor;
