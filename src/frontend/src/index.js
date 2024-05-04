import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import {} from "./css/bootstrap.min.css"
import {} from "./css/styles.css"
import { Stats } from './pages/Stats';
import { Projects } from './pages/Projects';
import { Project } from './pages/Project';
import { Archive } from './pages/Archive';
import { Login } from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Stats />
      },
      {
        path: 'archive',
        element: <Archive />
      },
      {
        path: 'projects',
        element: <Projects />
      },
      {
        path: 'project/:id',
        element: <Project />
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);