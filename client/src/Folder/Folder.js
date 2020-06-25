import React from 'react';
import { Link } from 'react-router-dom'
import './Folder.css';

export default function Folder(props) {
  return (
    <li className='folder-container'>
      <Link to={`/folder/${props.id}`}>
        <div>
          <h3>{props.name}</h3>
        </div>
      </Link>
    </li>
  )
}
