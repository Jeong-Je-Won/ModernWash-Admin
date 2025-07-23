import React from 'react'
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';


const Sidebar = () => {
  const nav = useNavigate();

  const userToken = useUserStore(state => state.userToken);

  const menuList = userToken ? [
    { label: '공지사항 관리', path: '/admin/notices?page=1&limit=10' },
    { label: 'FAQ 관리', path: '/admin/faqs?page=1&limit=10' },
  ] : [
    { label: 'FAQ', path: '/faqs' },
  ];


  return (
    <div>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            top: '64px',
            height: 'calc(100% - 64px)',
            backgroundColor: '#0a1834',
            color: '#fff',
          },
        }}
        open
      >
        <div>
          <List>
            {menuList.map((menu, idx) => (
              <ListItem
                button
                key={menu.label}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  transition: 'background 0.2s, color 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    color: '#0a1834',
                    '& .MuiListItemIcon-root, & .MuiSvgIcon-root': {
                      color: '#0a1834',
                    },
                  },
                  '&.Mui-selected, &.Mui-selected:hover': {
                    backgroundColor: '#e3f2fd',
                    color: '#0a1834',
                    '& .MuiListItemIcon-root, & .MuiSvgIcon-root': {
                      color: '#0a1834',
                    },
                  },
                }}
                onClick={() => nav(menu.path)}
              >
                <ListItemIcon sx={{ minWidth: 32, color: '#fff' }}>
                  <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                </ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  )
}

export default Sidebar