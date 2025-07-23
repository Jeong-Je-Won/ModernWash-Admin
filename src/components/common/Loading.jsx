import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loading = ({ text = "로딩 중..." }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      width: '100%',
      py: 4,
    }}
  >
    <CircularProgress color="primary" />
    <div style={{ marginTop: 16, color: '#1976d2', fontWeight: 500 }}>{text}</div>
  </Box>
);

export default Loading; 