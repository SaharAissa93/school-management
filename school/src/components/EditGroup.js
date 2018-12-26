import React, { Component } from "react";
import SplitterLayout from "react-splitter-layout";
import { ButtonToolbar, Button } from "react-bootstrap";

class EditGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentsAff: [],
      professorsAff: [],
      group: [],
      professorsAffAndNot: [],
      studentsAffAndNot: [],
      objConcatSt: [],
      objConcatProf: [],
      indexStudentsToAdd: [],
      indexStudentsToRemove: [],
      indexProfsToAdd: [],
      indexProfsToRemove: []
    };

    var groupIdPassed = this.props.groupidToPass;

    fetch("http://localhost:8080/professors?GroupId=" + groupIdPassed)
      .then(response => response.json())
      .then(data => {
        this.setState({ professorsAff: data });
      });

    this.SubmitEdit = this.SubmitEdit.bind(this);
    this.updateGroup();
    this.updateStudentsAff();
    this.updateProfessors();
    this.updateProfessorsDataAffAndNot();
    this.updateStudentsDataAffAndNot();
  }

  updateGroup() {
    var groupIdPassed = this.props.groupidToPass;
    fetch("http://localhost:8080/groups?GroupId=" + groupIdPassed)
      .then(response => response.json())
      .then(data => {
        this.setState({ group: data[0] });
      });
  }
  updateStudentsAff() {
    var groupIdPassed = this.props.groupidToPass;

    fetch("http://localhost:8080/students?GroupId=" + groupIdPassed)
      .then(response => response.json())
      .then(data => {
        this.setState({ studentsAff: data });
      });
  }
  updateProfessors() {
    var groupIdPassed = this.props.groupidToPass;

    fetch("http://localhost:8080/professors?GroupId=" + groupIdPassed)
      .then(response => response.json())
      .then(data => {
        this.setState({ professorsAff: data });
      });
  }
  updateProfessorsDataAffAndNot() {
    var groupIdPassed = this.props.groupidToPass;
    fetch(
      "http://localhost:8080/professors?GroupId=" + groupIdPassed + "&&GroupId="
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ professorsAffAndNot: data });
      });
  }

  updateStudentsDataAffAndNot() {
    var groupIdPassed = this.props.groupidToPass;
    fetch(
      "http://localhost:8080/students?GroupId=" + groupIdPassed + "&&GroupId= "
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ studentsAffAndNot: data });
      });
  }

  toggleChangeProfessor(index) {
    // current array of options
    const indexProfsToAdd = this.state.indexProfsToAdd;
    const indexProfsToRemove = this.state.indexProfsToRemove;

    let objToUpdate = this.state.professorsAffAndNot[index];

    // check if the check box is checked or unchecked
    if (objToUpdate.GroupId === "") {
      indexProfsToAdd.push(index);
    } else {
      indexProfsToRemove.push(index);
    }

    let checkboxes = document.querySelectorAll(
      '.checkboxprofs input[type="checkbox"]'
    );
    var checkboxesChecked = 0;
    var checkboxesUnchecked = 0;
    checkboxes.forEach(element => {
      if (element.checked) {
        checkboxesChecked++;
      } else {
        checkboxesUnchecked++;
      }
    });
    var profCap = parseInt(this.refs.professorCapacity.value);
    checkboxes.forEach(element => {
      if (checkboxesChecked === profCap && !element.checked) {
        element.disabled = true;
      } else {
        element.disabled = false;
      }
    });

    // update the state with the new array of options
    this.setState({ indexProfsToAdd: indexProfsToAdd });
    this.setState({ indexProfsToRemove: indexProfsToRemove });
  }
  toggleChangeStudent(index: number) {
    // current array of options
    const indexStudentsToAdd = this.state.indexStudentsToAdd;
    const indexStudentsToRemove = this.state.indexStudentsToRemove;
    let objToUpdate = this.state.studentsAffAndNot[index];

    // check if the check box is checked or unchecked
    if (objToUpdate.GroupId === "") {
      indexStudentsToAdd.push(index);
    } else {
      indexStudentsToRemove.push(index);
    }

    let checkboxes = document.querySelectorAll(
      '.checkboxst input[type="checkbox"]'
    );
    var checkboxesChecked = 0;
    var checkboxesUnchecked = 0;
    checkboxes.forEach(element => {
      if (element.checked) {
        checkboxesChecked++;
      } else {
        checkboxesUnchecked++;
      }
    });
    var stCap = parseInt(this.refs.studentCapacity.value);
    checkboxes.forEach(element => {
      if (checkboxesChecked === stCap && !element.checked) {
        element.disabled = true;
      } else {
        element.disabled = false;
      }
    });
    // update the state with the new array of options
    this.setState({ indexStudentsToAdd: indexStudentsToAdd });
    this.setState({ indexStudentsToRemove: indexStudentsToRemove });
  }

  renderStudentsAndProfessorsToEdit(
    studentsAffAndNot: Student[],
    professorsAffAndNot: Professor[]
  ) {
    let disabledOrEnabled;
    let disabledOrEnabledProf;

    let professors = this.state.professorsAff;
    let lengthOfProfessors = professors.length;

    let students = this.state.studentsAff;
    let lengthOfStudents = students.length;

    if (lengthOfStudents > this.state.group.studentCapacity - 1) {
      disabledOrEnabled = (
        <div>
          {studentsAffAndNot.map((value, index) => (
            <div className="checkboxst">
              <h4>
                <label key={index}>
                  <input
                    type="checkbox"
                    ref="studentName"
                    defaultChecked={value.GroupId === this.state.group.GroupId}
                    disabled={value.GroupId != this.state.group.GroupId}
                    onClick={event => this.toggleChangeStudent(index)}
                  />
                  {value.studentName}
                </label>
              </h4>
            </div>
          ))}
        </div>
      );
    } else {
      disabledOrEnabled = (
        <div>
          {studentsAffAndNot.map((value, index) => (
            <div className="checkboxst">
              <h4>
                <label key={index}>
                  <input
                    type="checkbox"
                    ref="studentName"
                    defaultChecked={value.GroupId === this.state.group.GroupId}
                    onClick={event => this.toggleChangeStudent(index)}
                  />
                  {value.studentName}
                </label>
              </h4>
            </div>
          ))}
        </div>
      );
    }

    if (lengthOfProfessors > this.state.group.professorCapacity - 1) {
      disabledOrEnabledProf = (
        <div>
          {professorsAffAndNot.map((value, index) => (
            <div className="checkboxprofs">
              <h4>
                <label>
                  <input
                    type="checkbox"
                    disabled={value.GroupId != this.state.group.GroupId}
                    ref="professorName"
                    disabled={value.GroupId != this.state.group.GroupId}
                    defaultChecked={value.GroupId === this.state.group.GroupId}
                    onClick={event => this.toggleChangeProfessor(index)}
                  />
                  {value.professorName}
                </label>
              </h4>
            </div>
          ))}
        </div>
      );
    } else {
      disabledOrEnabledProf = (
        <div>
          {professorsAffAndNot.map((value, index) => (
            <div className="checkboxprofs">
              <h4>
                <label>
                  <input
                    type="checkbox"
                    ref="professorName"
                    defaultChecked={value.GroupId === this.state.group.GroupId}
                    onClick={event => this.toggleChangeProfessor(index)}
                  />
                  {value.professorName}
                </label>
              </h4>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div>
        <h3>Students List To Edit </h3>
        {disabledOrEnabled}

        <h3>Professors List To Edit </h3>
        {disabledOrEnabledProf}
      </div>
    );
  }

  SubmitEdit(professorsAffAndNot: Professor[]) {
    let id = this.state.group.id;

    let GroupId = this.refs.GroupId.value;
    let groupName = this.refs.groupName.value;
    let studentCapacity = this.refs.studentCapacity.value;
    let professorCapacity = this.refs.professorCapacity.value;

    fetch("http://localhost:8080/groups/" + id, {
      method: "PUT",
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
    }).then(res => {
      this.props.renderDetailsGroup();
      this.props.updateDataFirstGroup();
    });
    //students
    this.state.indexStudentsToAdd.forEach(index => {
      let objToUpdate = this.state.studentsAffAndNot[index];

      let GroupId = this.state.group.GroupId;
      let studentName = objToUpdate.studentName;
      let studentAge = objToUpdate.studentAge;

      fetch("http://localhost:8080/students/" + objToUpdate.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ GroupId, studentName, studentAge })
      })
        .then(response => response.json())

        .then(data => {
          this.updateGroup();
          this.updateStudentsAff();
          this.updateStudentsDataAffAndNot();
        });
    });
    this.state.indexStudentsToRemove.forEach(index => {
      let objToUpdate = this.state.studentsAffAndNot[index];
      let GroupId = "";

      let studentName = objToUpdate.studentName;
      let studentAge = objToUpdate.studentAge;

      fetch("http://localhost:8080/students/" + objToUpdate.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ studentName, studentAge, GroupId })
      }).then(data => {
        this.updateGroup();
        this.updateStudentsAff();
        this.updateStudentsDataAffAndNot();
      });
    });
    //professors
    this.state.indexProfsToAdd.forEach(index => {
      let objToUpdate = this.state.professorsAffAndNot[index];

      let GroupId = this.state.group.GroupId;
      let professorName = objToUpdate.professorName;
      let professorAge = objToUpdate.professorAge;

      fetch("http://localhost:8080/professors/" + objToUpdate.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ GroupId, professorName, professorAge })
      })
        .then(response => response.json())

        .then(data => {
          this.updateGroup();
          this.updateProfessors();
          this.updateProfessorsDataAffAndNot();
        });
    });

    this.state.indexProfsToRemove.forEach(index => {
      let objToUpdate = this.state.professorsAffAndNot[index];
      let GroupId = "";

      let professorName = objToUpdate.professorName;
      let professorAge = objToUpdate.professorAge;

      fetch("http://localhost:8080/professors/" + objToUpdate.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ professorName, professorAge, GroupId })
      }).then(data => {
        this.updateGroup();
        this.updateProfessors();
        this.updateProfessorsDataAffAndNot();
      });
    });

    this.setState({ show: true });
    this.props.onClickEdit();
  }

  renderEditForm() {
    return (
      <div>
        <h3>Edit Group</h3>
        <form ref="myForm" className="myForm" onSubmit={this.SubmitEdit}>
          <div className="form-group row">
            <label className=" control-label col-md-12">
              <h4>Group Number</h4>
            </label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="GroupId"
                placeholder="Group Number"
                defaultValue={this.state.group.GroupId}
                disabled
              />
            </div>
          </div>
          <div className="form-group row">
            <label className=" control-label col-md-12">
              <h4>Group Name</h4>
            </label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="groupName"
                placeholder="Group Name"
                defaultValue={this.state.group.groupName}
                disabled
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-12">
              <h4>Student Capacity</h4>
            </label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="studentCapacity"
                placeholder="Student Capacity"
                defaultValue={this.state.group.studentCapacity}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-12">
              <h4>Professor Capacity</h4>
            </label>
            <div className="col-md-4">
              <input
                className="form-control"
                type="text"
                ref="professorCapacity"
                placeholder="Professor Capacity"
                defaultValue={this.state.group.professorCapacity}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <ButtonToolbar>
              <Button bsStyle="primary" type="submit">
                Save
              </Button>
              <Button bsStyle="default" onClick={this.props.onClickEdit}>
                Cancel
              </Button>
            </ButtonToolbar>
          </div>
        </form>
      </div>
    );
  }

  render() {
    let checkboxList = this.renderStudentsAndProfessorsToEdit(
      this.state.studentsAffAndNot,
      this.state.professorsAffAndNot
    );
    let editForm = this.renderEditForm();
    return (
      <SplitterLayout>
        <div>{editForm}</div>
        <div>{checkboxList}</div>
      </SplitterLayout>
    );
  }
}
export default EditGroup;
