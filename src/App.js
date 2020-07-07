import React from 'react';
import { Route, Link } from 'react-router-dom';
import NotefulContext from './NotefulContext';
import AppError from './AppError/AppError';
import FolderList from './FolderList/FolderList';
import NoteList from './NoteList/NoteList';
import FullNoteMain from './FullNoteMain/FullNoteMain';
import FullNoteSide from './FullNoteSide/FullNoteSide';
import AddFolder from './AddFolder/AddFolder';
import AddNote from './AddNote/AddNote';
import './App.css';

//TO RUN Noteful JSON Server
//git clone https://github.com/tomatau/noteful-json-server
//cd ./noteful-json-server
//npm install
//npm start


//TO ADD THE DATE FORMAT
//npm install date-fns --save

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folders: [],
      notes: [],
      error: null,
    };
  }

  setFolders = (folders) => {
    this.setState({
      folders,
      error: null,
    });
  };

  setNotes = (notes) => {
    this.setState({
      notes,
      error: null,
    });
  };

  addFolder = (folder) => {
    this.setState({
      folders: [...this.state.folders, folder],
    });
  };

  addNote = (note) => {
    this.setState({
      notes: [...this.state.notes, note],
    });
  };

  //the state should always be hydrated by data from databse
  //when we click delete somewhere else it should delete in databace first
  //then another GET request that will refresh state
  //this will trigger rerender

  handleDeleteNote = (noteId) => {
    fetch(`http://localhost:9090/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then(() => {
        this.sendGetRequest()
      })
      .catch(
        error => this.setState({error})
      )
  };

  // componentDidUpdate(prevProps, prevState) {
  //   //make a separate branch and look up how to make this work
  //   //this will allow the removal of onDeleteNote in Note
  //   console.log(prevState.notes)
  //   console.log(this.state.notes)
  //   if (prevState.notes !== this.state.notes || prevState.folders !== this.state.folders) {
  //     this.sendGetRequest()
  //   }
  // }

  componentDidMount() {
    this.sendGetRequest();
  }

  sendGetRequest() {
    Promise.all([
      fetch('http://localhost:9090/notes'),
      fetch('http://localhost:9090/folders')
    ])
      .then(([notesRes, foldersRes]) => {
        if (!notesRes.ok)
          return notesRes.json().then(e => Promise.reject(e));
        if (!foldersRes.ok)
          return foldersRes.json().then(e => Promise.reject(e));
        return Promise.all([notesRes.json(), foldersRes.json()]);
      })
      .then(([notes, folders]) => {
        this.setState({notes, folders});
      })
      .catch(error => {
        console.error({error});
      });
  }

  render() {
    const value = {
      folders: this.state.folders,
      notes: this.state.notes,
      deleteNote: this.handleDeleteNote,
      addFolder: this.addFolder,
      addNote: this.addNote,
    };
    return (
      <NotefulContext.Provider value={value}>
        <div className='App'>
          <header>
            <h1>
            <Link to='/'>Noteful</Link>
            </h1>
          </header>
          <div className='flex-container'>
            <AppError>
            <section className='column sidebar'>
              <Route exact path='/' component={FolderList} />
              <Route path='/folder/:folderId' component={FolderList} />
              <Route path='/note/:noteId' component={FullNoteSide} />
            </section>
            </AppError>
            <AppError>
            <main className='column'>
              <Route exact path='/' component={NoteList} />
              <Route path='/folder/:folderId' component={NoteList} />
              <Route path='/note/:noteId' component={FullNoteMain} />
              <Route path='/add-note' component={AddNote} />
              <Route path='/add-folder' component={AddFolder} />
            </main>
            </AppError>
          </div>
        </div>
      </NotefulContext.Provider>
    );
  }
}

export default App;