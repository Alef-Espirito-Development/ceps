import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

const Header = () => {
    return (
        <AppBar position="static" color="primary">
            <Box
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    p: 1,
                    bgcolor: 'secondary.main',
                    '&::-webkit-scrollbar': { height: 8 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.dark', borderRadius: 4 },
                    '& > *': { flex: '0 0 auto', mr: 2 }
                }}
            >
                {/* Banner para desktop */}
                <Box component="img"
                    src="/banner-desktop.png"
                    alt="Banner Desktop"
                    sx={{ display: { xs: 'none', sm: 'block' }, height: 150, width: 1440, borderRadius: 2 }}
                />

                {/* Banner para mobile */}
                <Box component="img"
                    src="/banner-mobile.png"
                    alt="Banner Mobile"
                    sx={{ display: { xs: 'block', sm: 'none' }, height: 80, width: 400, borderRadius: 2 }}
                />
            </Box>
        </AppBar>
    );
};

export default Header;
