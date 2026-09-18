import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/top-nav.css'

const TopNav = () => {
  return (
    <nav className="top-nav" role="navigation" aria-label="Top">
      <div className="top-nav__inner">
        <NavLink to="/" end className={({ isActive }) => `top-nav__link ${isActive ? 'is-active' : ''}`}>
          Home
        </NavLink>
        <NavLink to="/register" className={({ isActive }) => `top-nav__link ${isActive ? 'is-active' : ''}`}>
          Register
        </NavLink>
        <NavLink to="/user/login" className={({ isActive }) => `top-nav__link ${isActive ? 'is-active' : ''}`}>
          User Login
        </NavLink>
        <NavLink to="/food-partner/login" className={({ isActive }) => `top-nav__link ${isActive ? 'is-active' : ''}`}>
          Food Partner Login
        </NavLink>
      </div>
    </nav>
  )
}

export default TopNav
