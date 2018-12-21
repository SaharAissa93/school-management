import React, { Component } from "react";
import { Modal, ButtonToolbar, Button } from "react-bootstrap";
import AddStudent from "../components/AddStudent";

import {
  BootstrapTable,
  TableHeaderColumn,
  BootstrapButton
} from "react-bootstrap-table";

class StudentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupNumbers: [],
      studentList: [],
      addStudentText: "Save Student",
      filteredStudentList: []
    };
    fetch("http://localhost:8080/students")
      .then(response => response.json())
      .then(data => {
        this.setState({ studentList: data });
      });

    fetch("http://localhost:8080/groups")
      .then(response => response.json())
      .then(data => {
        this.setState({ groupNumbers: data });
      });

    // This binding is necessary to make "this" work in the callback
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.updateStudents = this.updateStudents.bind(this);

    this.updateStudents();
  }
  updateStudents() {
    fetch("http://localhost:8080/students")
      .then(response => response.json())
      .then(data => {
        this.setState({ studentList: data });
      });
  }
  handleDelete(id: number) {
    fetch("http://localhost:8080/students/" + id, {
      method: "delete"
    }).then(data => {
      this.setState({
        studentList: this.state.studentList.filter(rec => {
          return rec.id !== id;
        })
      });
    });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(id: number) {
    fetch("http://localhost:8080/students/" + id).then(studentData => {
      this.setState({ show: true, studentId: id });
    });
  }

  /*buttonFormatter(id : number) {

    return (
      <ButtonToolbar>
        <Button bsStyle="warning" onClick={event => this.handleShow(id)}>
          Edit
        </Button>
        <Button bsStyle="danger" onClick={event => this.handleDelete(id)}>
          Delete
        </Button>
      </ButtonToolbar>
    );
  }*/

  renderStudents(studentList: Student[]) {
    return (
      <div>
        <Button bsStyle="primary" onClick={this.handleShow}>
          Create New Student
        </Button>

        {/* <BootstrapTable bootstrap4 keyField="id" data={studentList}>
          <TableHeaderColumn dataField="id">Student ID</TableHeaderColumn>
          <TableHeaderColumn dataField="studentName">
            Student Name
          </TableHeaderColumn>
          <TableHeaderColumn dataField="studentAge">
            Student Age
          </TableHeaderColumn>
          <TableHeaderColumn dataField="GroupId">
            Group Numbers
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="button"
            dataFormat={this.buttonFormatter}
          >
            Buttons
          </TableHeaderColumn>
        </BootstrapTable> */}

        <table className="table">
          <thead>
            <tr>
              <th />
              <th>
                <h4>Student Id</h4>
              </th>
              <th>
                <h4>Student Name</h4>
              </th>
              <th>
                <h4>Student Age</h4>
              </th>
              <th>
                <h4>Group Numbers</h4>
              </th>
              <th>
                <h4>Actions</h4>
              </th>
            </tr>
          </thead>
          <tbody>
            {studentList.map(student => (
              <tr>
                <td />
                <td>
                  <h4>{student.id}</h4>
                </td>
                <td>
                  <h4>{student.studentName}</h4>
                </td>
                <td>
                  <h4>{student.studentAge}</h4>
                </td>
                <td>
                  <h4>{student.GroupId}</h4>
                </td>

                <td>
                  <ButtonToolbar>
                    <Button
                      bsStyle="warning"
                      onClick={event => this.handleShow(student.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      bsStyle="danger"
                      onClick={event => this.handleDelete(student.id)}
                    >
                      Delete
                    </Button>
                  </ButtonToolbar>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  renderCreateFormModalStudent(studentList: Student[]) {
    return (
      <div className="static-modal">
        <Modal show={this.state.show}>
          <Modal.Title>
            <h1>{this.state.title}</h1>
          </Modal.Title>

          <Modal.Body>
            <AddStudent
              groupNumbers={this.state.groupNumbers}
              text={this.state.addStudentText}
              onClickClose={this.handleClose}
              studentId={this.state.studentId}
              updateStudents={this.updateStudents}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  render() {
    let contents = this.renderStudents(this.state.studentList);
    let contentsForCreate = this.renderCreateFormModalStudent(
      this.state.studentList
    );
    return (
      <div>
        <h3>Student List</h3>

        {contents}
        {contentsForCreate}
      </div>
    );
  }
}

export default StudentScreen;
