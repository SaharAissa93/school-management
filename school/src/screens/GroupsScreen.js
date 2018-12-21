import React, { Component } from "react";
import Student from "../models/Student";
import Group from "../models/Group";
import Professor from "../models/Professor";
import SplitterLayout from "react-splitter-layout";
import AddGroup from "../components/AddGroup";
import EditGroup from "../components/EditGroup";
import { ButtonToolbar, Button } from "react-bootstrap";

class GroupsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null,
      groupList: [],
      filteredStudentList: [],
      filteredProfessorList: [],
      show: true,
      groupidToPass: 0,
      uniqueId: 0,
      student: [],
      professor: [],
      groupid: []
    };

    this.dataGroups = this.dataGroups.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleShowEdit = this.handleShowEdit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    //for communication between groupsScreen and EditGroup
    this.renderDetailsGroup = this.renderDetailsGroup.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.updateDataFirstGroup = this.updateDataFirstGroup.bind(this);

    this.dataGroups();
    this.updateDataFirstGroup();
  }

  dataGroups() {
    fetch("http://localhost:8080/groups")
      .then(response => response.json())
      .then(data => {
        this.setState({ groupList: data });
      });
  }

  updateDataFirstGroup() {
    fetch("http://localhost:8080/groups")
      .then(response => response.json())
      .then(data => {
        this.setState({ groupList: data });
        this.renderDetailsGroup(this.state.groupList[0].GroupId);
        this.setState({ active: 0 });
      });
  }
  renderDetailsGroup(groupid: number, index) {
    fetch("http://localhost:8080/students?GroupId=" + groupid)
      .then(response => response.json())
      .then(studentData => {
        this.setState({
          filteredStudentList: studentData,
          groupidToPass: groupid
        });
      });

    fetch("http://localhost:8080/professors?GroupId=" + groupid)
      .then(response => response.json())
      .then(professorData => {
        this.setState({
          filteredProfessorList: professorData,
          groupidToPass: groupid
        });
      });

    if (this.state.active === index) {
      this.setState({ active: null });
    } else {
      this.setState({ active: index });
    }
  }
  myColor(index) {
    if (this.state.active === index) {
      return "magenta";
    }
    return "";
  }
  renderGroups(groupList: Group[]) {
    return (
      <div>
        {groupList.map((group, index) => (
          <ul>
          <h4>
            <li
              key={index}
              style={{ color: this.myColor(index) }}
              onClick={event => {
                this.renderDetailsGroup(group.GroupId, index);
                //pour delete group
                this.setState({ uniqueId: group.id });
              }}
            >
              {group.groupName}
            </li>
            </h4>
          </ul>
        ))}
      </div>
    );
  }

  renderStudentsAndProfessors(
    filteredStudentList: Student[],
    filteredProfessorList: Professor[]
  ) {
    return (
      <div>
        <h3>Students in this group</h3>

        {/* l'élément sélectionné */}
        {filteredStudentList.map(student => (
          <div>
            <ul>
              <li><h4>{student.studentName}</h4></li>
            </ul>
          </div>
        ))}

        <h3>Professors affected to this group</h3>
        {filteredProfessorList.map(professor => (
          <div>
            <ul>
              <li><h4>{professor.professorName}</h4></li>
            </ul>
          </div>
        ))}
      </div>
    );
  }

  handleShow() {
    this.setState({ showEdit: false, show: false });
  }
  handleCloseEdit() {
    this.setState({ showEdit: true, show: true });
  }
  handleShowEdit(groupid: number) {
    console.log("group id: ", this.state.groupidToPass);
    this.setState({ show: false, showEdit: true });
  }
  concat(...args) {
    return args.reduce((acc, val) => [...acc, ...val]);
  }

  onDelete(id: number, groupid: number) {
    fetch("http://localhost:8080/groups/" + id, {
      method: "delete"
    }).then(data => {
      this.setState({
        groupList: this.state.groupList.filter(rec => {
          return rec.id !== id;
        })
      });
    });

    let objStudent = this.state.filteredStudentList;
    let objProfessor = this.state.filteredProfessorList;

    objStudent.map(student => {
      let studentName = student.studentName;
      let studentAge = student.studentAge;
      let GroupId = "";
      fetch("http://localhost:8080/students/" + student.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ GroupId, studentName, studentAge })
      }).then(response => response.json());
    });

    objProfessor.map(professor => {
      let professorName = professor.professorName;
      let professorAge = professor.professorAge;
      let GroupId = "";
      fetch("http://localhost:8080/professors/" + professor.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ GroupId, professorName, professorAge })
      }).then(data => {
        this.updateDataFirstGroup();
        this.renderDetailsGroup(professor.GroupId);
      });
    });
  }
  renderGroupsAndDetails() {
    let contentsOfGroupNumbers = this.renderGroups(this.state.groupList);
    let contentOfStudentsAndProfessors = this.renderStudentsAndProfessors(
      this.state.filteredStudentList,
      this.state.filteredProfessorList
    );
    return (
      <SplitterLayout>
        <div>
          <h3>Groups Numbers</h3>
          {contentsOfGroupNumbers}

          <Button bsStyle="primary" onClick={this.handleShow} type="submit">
            Create New Group
          </Button>
        </div>

        <div>
          {contentOfStudentsAndProfessors}
          <ButtonToolbar>
            <Button
              bsStyle="warning"
              onClick={groupid => this.handleShowEdit(groupid)}
            >
              Edit
            </Button>

            <Button
              onClick={id => {
                const r = window.confirm(
                  "Are you sure you wish to delete this Group numéro : " +
                    this.state.groupidToPass +
                    "?"
                );
                if (r === true)
                  this.onDelete(this.state.uniqueId, this.state.groupidToPass);
              }}
              bsStyle="danger"
            >
              Delete
            </Button>
          </ButtonToolbar>
        </div>
      </SplitterLayout>
    );
  }

  handleClose() {
    this.setState({ show: true });
  }

  renderAddForm() {
    return (
      <AddGroup
        funcDataGroups={this.dataGroups}
        groupId={this.state.groupId}
        onClick={this.handleClose}
      />
    );
  }
  renderEditForm() {
    return (
      <div>
        <EditGroup
          renderDetailsGroup={this.renderDetailsGroup}
          onClickEdit={this.handleCloseEdit}
          studentNotAffectedList={this.studentNotAffectedList}
          groupidToPass={this.state.groupidToPass}
          updateDataFirstGroup={this.updateDataFirstGroup}
        />
      </div>
    );
  }
  render() {
    let GroupsAndDetails = this.renderGroupsAndDetails();
    let AddForm = this.renderAddForm();
    let editForm = this.renderEditForm();

    if (this.state.show === true) {
      return <div>{GroupsAndDetails}</div>;
    } else {
      if (this.state.showEdit === true) {
        return <div>{editForm}</div>;
      } else {
        return <div>{AddForm}</div>;
      }
    }
  }
}

export default GroupsScreen;
