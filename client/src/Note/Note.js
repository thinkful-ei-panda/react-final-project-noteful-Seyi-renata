import React from 'react';
import './Note.css';
import { Link } from 'react-router-dom'
import NotefulContext from '../NotefulContext'
import format from 'date-fns/format'

export default class Note extends React.Component {
  static defaultProps = {
    onDeleteNote: () => { },
  }
  static contextType = NotefulContext;

  handleClickDelete = e => {
    e.preventDefault()
    const noteId = this.props.id;

    fetch(`http://localhost:9090/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(() => {
        this.context.deleteNote(noteId)
        this.props.onDeleteNote(noteId) //this basically just rerenders this component
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const modified = this.props.dateMod
    return (
      <li
        onClick={() => console.log(this.props.name)}
        className='note-container'>
        <Link to={`/note/${this.props.id}`}>
          <div>
            <h3>{this.props.name}</h3>
          </div>
        </Link>
        <section>
          <p>Last Modified: {format(new Date(modified), 'MM/dd/yyyy')}</p>
        </section>
        <div>
          <button
            onClick={this.handleClickDelete}
          >
            Delete
          </button>
        </div>
      </li>
    )
  }
}
