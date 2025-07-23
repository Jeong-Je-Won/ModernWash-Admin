import React, { useState } from 'react'

import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { api } from '../config/api.config';
import useUserStore from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const nav = useNavigate();

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const { setUserToken } = useUserStore();

    const handleLogin = () => {
        if (!id || !password) {
            alert('아이디와 비밀번호를 입력해주세요.');
            return;
        } else {
            api.post('/admin/login', {
                id,password
            }).then((res) => {
                if(res.status === 200) {
                    alert('로그인 성공');
                    setUserToken(res.data.token);
                    nav('/');
                }
            }).catch((err) => {
                alert('아이디 또는 비밀번호가 일치하지 않습니다.');
                setId('');
                setPassword('');
            });
        }
    }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          로그인
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            label="아이디"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            label="비밀번호"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => {
                if(e.key === 'Enter') {
                    handleLogin();
                }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            로그인
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login