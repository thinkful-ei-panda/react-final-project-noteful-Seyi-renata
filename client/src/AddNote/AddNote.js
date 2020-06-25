import React, {Component} from 'react';
import NotefulContext from '../NotefulContext';
import ValidationError from '../ValidationError';
import {format} from 'date-fns';
import PropTypes from 'prop-types';


class AddNote extends Component{

    static contextType = NotefulContext;

    constructor(props) {
        super(props);
        this.state = {
            noteName: {
                value: '',
                touched: false,
            },
            noteContent: '',
            noteFolder: '',
            error: null,
        }
    }

    updateNoteName(noteContent){
        this.setState({noteContent: noteContent});
    }

    updateName(noteName){
        this.setState({noteName: {value: noteName, touched: true}});
    }

    updateNoteContent(noteContent) {
        this.setState({noteContent: noteContent});
    }

    updateNoteFolder(noteFolder){
        this.setState({noteFolder: noteFolder});
    }

    validateNoteName(){
        const noteName = this.setState.noteName.value.trim();
        if(noteName.length === 0){
            return 'Note name is Required';
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        const noteName = this.state.noteName.value;
        const noteContent = this.state.noteContent;
        const noteFolder = this.state.noteFolder;
        const currentTime = format(new Date(), 'yyyy-MM-dd 0000');

        const noteObj = {
            name: noteName,
            modified: currentTime,
            folderId: noteFolder,
            content: noteContent,
        }

        fetch (`http://localhost:9090/notes`, {
            method: 'POST',
            body: JSON.stringify(noteObj),
            headers: {
                'context-type': 'application/json',
            },
        })
        .then (res => {
            if(!res.ok){
                return res.json().then(error => {
                    throw error
                })
            }
            return res.json()
        })
        .then (data => {
            this.context.AddNote(data)
            this.props.history.push('/')
        })
        .catch(error => {
            console.log(error)
            this.setState({error})
        })
    }

    handleClickCancel = () => {
        this.props.history.push('/')
    };

    render() {
        const {error} = this.state;
        const {folders} = this.context;

        const folderOptions = folders.map(folder =>
            <option
                key={folder.id}
                value={folder.id}>
                {folder.name}
            </option>
            );
        
        const noteName = this.state.noteName.value.trim();
        const disableSave = noteName.length === 0 ? true: false;
        return (
            <section className='AddNote'>
        <h2>Create a Note</h2>
        <form onSubmit={this.handleSubmit}>
          <div role='alert'>
            {error && <p>{error.message}</p>}
          </div>

          <div>
            <label htmlFor='noteName'>
              Note Name:
            </label>
            {' '}
            <input 
              type='text'
              name='noteName'
              id='noteName'
              placeholder='Name of Note'
              onChange={event => this.updateNoteName(event.target.value)}
              />
              {this.state.noteName.touched && <ValidationError message={this.validateNoteName()} />}
          </div>

          <div>
            <label htmlFor='noteContent'>
              Note:
            </label>
            {' '}
            <textarea 
              name='noteContent'
              id='noteContent'
              onChange={event => this.updateNoteContent(event.target.value)}
              />
          </div>

          <div>
            <label>
                Folder:
            </label>
            {' '}
            <select 
              id='folders' 
              name='folders'
              onChange={event => this.updateNoteFolder(event.target.value)}
              required >
                <option value=''></option>
              {folderOptions}
            </select>
          </div>

          <div>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button disabled={disableSave} type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
        )
    }
}

AddNote.propTypes = {
    history: PropTypes.object,
  };

export default AddNote;