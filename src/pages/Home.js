import React, { useState } from 'react';
import { Container, TextField, Autocomplete, Button, Typography, Box, Paper, CircularProgress, Tabs, Tab, MenuItem } from '@mui/material';
import axios from 'axios';
//import logradourosList from './../components/logradouros';
import agentesSaude from './../components/agentes';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import ApartmentIcon from '@mui/icons-material/Business';
import MapIcon from '@mui/icons-material/Map';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeIcon from '@mui/icons-material/Home';
import DomainIcon from '@mui/icons-material/Domain';
import LocationCityIcon from '@mui/icons-material/LocationCity';

const Home = () => {
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState({ type: '', street: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const tiposLogradouros = [
        "Avenida", "Rua", "Viela", "Travessa", "Alameda", "Estrada", "Rodovia",
        "Praça", "Largo", "Beco", "Boulevard", "Caminho", "Chácara", "Condomínio",
        "Esplanada", "Galeria", "Jardim", "Parque", "Passarela", "Passeio",
        "Quadra", "Setor", "Servidão", "Sítio", "Viaduto", "Vila", "Conjunto",
        "Córrego", "Morro"
    ];

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setCep('');                        // Limpa o campo de CEP
        setAddress({ type: '', street: '' }); // Limpa os campos de endereço
        setResult(null);                   // Limpa os resultados da busca
    };

    const validateCep = (cep) => /^[0-9]{8}$/.test(cep);

    const handleSearchCep = async () => {
        if (!validateCep(cep)) {
            alert('CEP inválido! Digite apenas números e 8 dígitos.');
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            setResult(response.data);
        } catch (error) {
            alert('Erro ao buscar o CEP.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchAddress = async () => {
        const { type, street } = address;
        if (!type || !street) {
            alert('Por favor, selecione o tipo de logradouro e digite o nome.');
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            const response = await axios.get(`https://viacep.com.br/ws/MS/Inocência/${type} ${street}/json/`);
            setResult(response.data);
        } catch (error) {
            alert('Erro ao buscar o endereço.');
        } finally {
            setLoading(false);
        }
    };

    // Função para formatar o código IBGE
    const formatIBGE = (ibge) => {
        if (ibge && ibge.length === 7) {
            return `${ibge.slice(0, 2)}-${ibge.slice(2)}`;
        }
        return ibge;
    };

    // Função para formatar o código SIAFI
    const formatSIAFI = (siafi) => {
        if (siafi) {
            return siafi.padStart(6, '0'); // Garante 6 dígitos
        }
        return siafi;
    };

    return (
        <Container maxWidth="sm" sx={{ mt: { xs: 2, sm: 5 }, px: { xs: 2, sm: 4 } }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                    Pesquisa de CEP
                </Typography>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Por Endereço" />
                    <Tab label="Por CEP" />
                </Tabs>

                {tabValue === 0 && (
                    <>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="body1" gutterBottom>Estado: MS</Typography>
                            <Typography variant="body1" gutterBottom>Cidade: Inocência</Typography>
                        </Box>
                        <Autocomplete
                            freeSolo
                            options={tiposLogradouros}
                            value={address.type || ''}  // Garante que seja uma string, não null
                            onChange={(event, newValue) => setAddress({ ...address, type: newValue || '' })}
                            inputValue={address.type || ''}  // Previne valores nulos
                            onInputChange={(event, newInputValue) => setAddress({ ...address, type: newInputValue || '' })}
                            renderInput={(params) => (
                                <TextField {...params} label="Tipo de Logradouro" variant="outlined" fullWidth sx={{ mb: 2 }} />
                            )}
                        />
                        <TextField
                            label="Nome do Logradouro"
                            variant="outlined"
                            value={address.street}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" color="primary" onClick={handleSearchAddress} fullWidth disabled={loading} startIcon={<SearchIcon />}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Pesquisar'}
                        </Button>
                    </>
                )}

                {tabValue === 1 && (
                    <>
                        <TextField label="Digite o CEP" variant="outlined" value={cep} onChange={(e) => setCep(e.target.value)} fullWidth sx={{ my: 2 }} inputProps={{ maxLength: 8 }} />
                        <Button variant="contained" color="primary" onClick={handleSearchCep} fullWidth disabled={loading} startIcon={<SearchIcon />}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Pesquisar'}
                        </Button>
                    </>
                )}

                {/* Filtro de Bairros */}
                {tabValue === 0 && (
                    <TextField
                        select
                        label="Filtrar por Bairro"
                        value={address.bairro || ''}
                        onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="">Todos os Bairros</MenuItem>
                        {agentesSaude.map((agente, index) => (
                            <MenuItem key={index} value={agente.bairro}>
                                {agente.bairro}
                            </MenuItem>
                        ))}
                    </TextField>
                )}

                {/* Exibição dos resultados filtrados */}
                {result && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">Resultado:</Typography>
                        {(Array.isArray(result) ? result : [result])
                            .filter(item => !address.bairro || item.bairro === address.bairro)
                            .map((item, index) => (
                                <Paper key={index} elevation={3} sx={{ p: 2, mb: 2, position: 'relative', borderRadius: 2 }}>
                                    <Typography><LocationOnIcon /> <strong>CEP:</strong> {item.cep}</Typography>
                                    <Typography><LocationCityIcon /> <strong>Cidade:</strong> {item.localidade} - {item.uf}</Typography>
                                    <Typography><PhoneIcon /> <strong>DDD:</strong> {item.ddd}</Typography>
                                    <Typography><ApartmentIcon /> <strong>IBGE:</strong> {formatIBGE(item.ibge)}</Typography>
                                    <Typography><MapIcon /> <strong>Região:</strong> {item.regiao}</Typography>
                                    <Typography><AccountBalanceIcon /> <strong>SIAFI:</strong> {formatSIAFI(item.siafi)}</Typography>
                                    <Typography><HomeIcon /> <strong>Logradouro:</strong> {item.logradouro}</Typography>
                                    <Typography><DomainIcon /> <strong>Bairro:</strong> {item.bairro}</Typography>
                                </Paper>
                            ))}
                    </Box>
                )}

            </Paper>
        </Container>
    );
};

export default Home;
