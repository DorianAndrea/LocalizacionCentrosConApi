import React from 'react';
import { styled } from '@mui/system';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const FooterAppBar = styled(AppBar)({
  top: 'auto',
  bottom: 0,
  backgroundColor: '#9900ff',
});

const Footer = () => {
  return (
    <FooterAppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="instagram">
          <InstagramIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="facebook">
          <FacebookIcon />
        </IconButton>
      </Toolbar>
    </FooterAppBar>
  );
};

export default Footer;
