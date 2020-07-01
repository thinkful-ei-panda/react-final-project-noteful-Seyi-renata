import React, { Component } from 'react';
import NotefulContext from '../NotefulContext';
import ValidationError from '../ValidationError';
import PropTypes from 'prop-types';

class AddFolder extends Component {
  static contextType = NotefulContext;

  constructor(props) {
    super(props);
    this.state = {
      folderName: {
        value: '',
        touched: false,
      },
      error: null,
    };
  }

  updateFolderName(folderName) {
    this.setState({ folderName: { value: folderName, touched: true } });
  }

  validateFolderName() {
    const folderName = this.state.folderName.value.trim();
    if (folderName.length === 0) {
      return 'Folder name is Required';
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const folderName = this.state.folderName.value;
    const folderObj = { name: folderName };
    fetch(`http://localhost:9090/folders`, {
      method: 'POST',
      body: JSON.stringify(folderObj),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            throw error;
          });
        }
        return res.json();
      })
      .then((data) => {
        this.context.addFolder(data);
        this.props.history.push('/');
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error });
      });
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const { error } = this.state;
    const folderName = this.state.folderName.value.trim();
    const disableSave = folderName.length === 0 ? true : false;

    return (
      <section>
        <h2>Add a Folder</h2>
        <form onSubmit={this.handleSubmit}>
          <div role='alert'>{error && <p>{error.message}</p>}</div>
          <div>
            <label htmlFor='foldername'>Folder Name:</label>{' '}
            <input
              type='text'
              name='foldername'
              id='foldername'
              placeholder='Name of Folder'
              onChange={(event) => this.updateFolderName(event.target.value)}
            />
            {this.state.folderName.touched && (
              <ValidationError message={this.validateFolderName()} />
            )}
          </div>
          <div>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>{' '}
            <button disabled={disableSave} type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

AddFolder.propTypes = {
  history: PropTypes.object,
};

export default AddFolder;
