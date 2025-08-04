import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import { api } from '../../config/api.config';

const Header = () => {
    const nav = useNavigate();

    const { userToken,setUserToken } = useUserStore();

    return (
        <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => nav('/')}>
                ModernWash
            </Typography>
            {userToken ? (
                <Button color="inherit" onClick={() => {
                    setUserToken(null);
                    delete api.defaults.headers.common['Authorization'];
                    localStorage.removeItem('user-storage');
                    nav('/');
                }}>Logout</Button>
            ) : (
                <Button color="inherit" onClick={() => nav('/login')}>Login</Button>
            )}
        </Toolbar>
        </AppBar>
    )
}

export default Header