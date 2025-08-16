import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { TitlePage } from './pages/TitlePage';
import { EpisodePage } from './pages/EpisodePage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/library',
        element: <LibraryPage />,
    },
    {
        path: '/title/:id',
        element: <TitlePage />,
    },
    {
        path: '/episode/:id',
        element: <EpisodePage />,
    },
    {
        path: '/profile',
        element: <ProfilePage />,
    },
    {
        path: '/search',
        element: <SearchPage />,
    },
]);
