import React, { Component } from "react";
import { Modal, ButtonToolbar, Button } from "react-bootstrap";
import AddProfessor from "../components/AddProfessor";
class ProfessorsScreen extends Component {
  constructor(props, context) {
    super(props);
    this.state = { professorList: [] , groupNumbers : []};
    fetch("http://localhost:8080/professors")
      .then(response => response.json())
      .then(data => {
        this.setState({ professorList: data });
      });

    // This binding is necessary to make "this" work in the callback
    this.handleDelete = this.handleDelete.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateProfessors = this.updateProfessors.bind(this);

    this.updateProfessors();
    fetch("http://localhost:8080/groups")
      .then(response => response.json())
      .then(data => {
        this.setState({ groupNumbers: data });
      });
  }
  updateProfessors() {
    fetch("http://localhost:8080/professors")
      .then(response => response.json())
      .then(data => {
        this.setState({ professorList: data });
      });
  }
  handleDelete(id: number) {
    fetch("http://localhost:8080/professors/" + id, {
      method: "delete"
    }).then(data => {
      this.setState({
        professorList: this.state.professorList.filter(rec => {
          return rec.id !== id;
        })
      });
    });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(id: number) {
    fetch("http://localhost:8080/professors/" + id).then(professorData => {
      this.setState({ show: true, professorId: id });
    });
  }



  renderProfessors(professorList: Professor[]) {
    return (
      <div>
        <Button bsStyle="primary" onClick={this.handleShow}>
          Create New Professor
        </Button>

        <table className="table">
          <thead>
            <tr>
              <th />
              <th><h4>Professor Id</h4></th>
              <th><h4>Professor Name</h4></th>
              <th><h4>Professor Age</h4></th>
              <th><h4>Group Numbers</h4></th>
              <th><h4>Actions</h4></th>
            </tr>
          </thead>
          <tbody>
            {professorList.map(professor => (
              <tr>
                <td />
                <td><h4>{professor.id}</h4></td>
                <td><h4>{professor.professorName}</h4></td>
                <td><h4>{professor.professorAge}</h4></td>
                <td><h4>{professor.GroupId}</h4></td>

                <td>
                  <ButtonToolbar>
                    <Button
                      bsStyle="warning"
                      onClick={id => this.handleShow(professor.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      bsStyle="danger"
                      onClick={id => this.handleDelete(professor.id)}
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
  renderCreateFormModalProfessor() {
    return (
      <div className="static-modal">
        <Modal show={this.state.show}>
          <Modal.Title>
            <h1>{this.state.title}</h1>
          </Modal.Title>

          <Modal.Body>
            <AddProfessor
              onClickClose={this.handleClose}
              professorId={this.state.professorId}
              onClick={this.handleClose}
              updateProfessors={this.updateProfessors}
              groupNumbers={this.state.groupNumbers}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
  render() {
    let contents = this.renderProfessors(this.state.professorList);
    let contentsForCreate = this.renderCreateFormModalProfessor();
    return (
      <div>
        <h3>Professors List</h3>

        {contents}
        {contentsForCreate}
      </div>
    );
  }
}

export default ProfessorsScreen;
