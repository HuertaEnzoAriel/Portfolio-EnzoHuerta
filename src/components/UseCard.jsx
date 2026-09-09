// src/components/UserCard.jsx
import { useState } from 'react'

const UserCard = ({ user, onFollow }) => {
  const [open, setOpen] = useState(false)
  const { name, screenName, role } = user

  return (
    <article className="user-card">
      <header>
        <h3>{name}</h3>
        <span className="screen-name">@{screenName}</span>
      </header>
      <p className="role">{role}</p>
      {open && <p>Detalles ampliados...</p>}
      <button onClick={() => setOpen(!open)}>
        {open ? 'Ocultar' : 'Más'}
      </button>
      <button onClick={() => onFollow(screenName)}>Seguir</button>
    </article>
  )
}

export default UserCard