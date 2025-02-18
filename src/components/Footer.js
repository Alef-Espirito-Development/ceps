import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 2,
                textAlign: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                position: 'relative',
                bottom: 0,
                width: '100%',
                fontSize: { xs: '0.75rem', sm: '0.9rem' },
                flexDirection: { xs: 'column', sm: 'row' }
            }}
        >
            <Typography variant="body2">
                © {new Date().getFullYear()} Prefeitura Municipal de Inocência - MS. Todos os direitos reservados.
            </Typography>
            <Typography variant="body2">
                Contato: (67) 0000-0000 | Endereço: Rua Exemplo, 123, Inocência-MS
            </Typography>
        </Box>
    );
};

export default Footer;
