import React, { useState } from 'react';
import { Container, TextField, Autocomplete, Button, Typography, Box, Paper, CircularProgress, Tabs, Tab, MenuItem } from '@mui/material';
import axios from 'axios';
import logradourosList from './../components/logradouros';
import agentesSaude from './../components/agentes';
import SearchIcon from '@mui/icons-material/Search'; //Para botão de pesquisa
import LocationOnIcon from '@mui/icons-material/LocationOn';  // Para CEP
import PhoneIcon from '@mui/icons-material/Phone';  // Para DDD
import ApartmentIcon from '@mui/icons-material/Business';  // Para IBGE (Instituição/Órgão)
import MapIcon from '@mui/icons-material/Map';  // Para Região
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';  // Para SIAFI (Sistema Financeiro)
import HomeIcon from '@mui/icons-material/Home';  // Para Logradouro
import DomainIcon from '@mui/icons-material/Domain';  // Para Bairro
import LocationCityIcon from '@mui/icons-material/LocationCity';  // Para Cidade


const Home = () => {
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState({ type: '', street: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => setTabValue(newValue);

    const getAgenteByBairro = (bairro) => {
        if (!bairro) return null;

        const agente = agentesSaude.find((agente) => {
            return agente.bairro.trim().toLowerCase() === bairro.trim().toLowerCase();
        });

        return agente || null;
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
                        <TextField select label="Tipo de Logradouro" value={address.type} onChange={(e) => setAddress({ ...address, type: e.target.value })} fullWidth sx={{ mb: 2 }}>
                            <MenuItem value="Avenida">Avenida</MenuItem>
                            <MenuItem value="Rua">Rua</MenuItem>
                            <MenuItem value="Viela">Viela</MenuItem>
                            <MenuItem value="Travessa">Travessa</MenuItem>
                            <MenuItem value="Alameda">Alameda</MenuItem>
                        </TextField>
                        <Autocomplete freeSolo options={logradourosList} value={address.street} onChange={(event, newValue) => setAddress({ ...address, street: newValue })} onInputChange={(event, newInputValue) => setAddress({ ...address, street: newInputValue })} renderInput={(params) => (
                            <TextField {...params} label="Nome do Logradouro" variant="outlined" />
                        )} fullWidth sx={{ mb: 2 }} />
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

                {/* Exibição dos resultados filtrados */}
                {result && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6">Resultado:</Typography>
                        {(Array.isArray(result) ? result : [result])
                            .filter(item => !address.bairro || item.bairro === address.bairro)
                            .map((item, index) => (
                                <Paper key={index} elevation={3} sx={{ p: 2, mb: 2, position: 'relative', borderRadius: 2 }}>
                                    <Typography><LocationOnIcon /> <strong>CEP:</strong> {item.cep}</Typography>
                                    <Typography><PhoneIcon /> <strong>DDD:</strong> {item.ddd}</Typography>
                                    <Typography><ApartmentIcon /> <strong>IBGE:</strong> {formatIBGE(item.ibge)}</Typography>
                                    <Typography><MapIcon /> <strong>Região:</strong> {item.regiao}</Typography>
                                    <Typography><AccountBalanceIcon /> <strong>SIAFI:</strong> {formatSIAFI(item.siafi)}</Typography>

                                    {tabValue === 0 && (
                                        <>
                                            <Typography><HomeIcon /> <strong>Logradouro:</strong> {item.logradouro}</Typography>
                                            <Typography><DomainIcon /> <strong>Bairro:</strong> {item.bairro}</Typography>
                                            <Typography><LocationCityIcon /> <strong>Cidade:</strong> {item.localidade} - {item.uf}</Typography>

                                            {getAgenteByBairro(item.bairro) && (
                                                <Box sx={{ mt: 2, textAlign: 'left' }}>
                                                    <Typography sx={{ fontWeight: 'bold', color: '#006a28', fontSize: 16 }}>
                                                        Agente de Saúde:
                                                    </Typography>
                                                    <Typography sx={{ fontWeight: 'bold', color: '#006a28', fontSize: 14 }}>
                                                        {getAgenteByBairro(item.bairro).nome}
                                                    </Typography>
                                                    <Typography sx={{ fontWeight: 'bold', color: '#006a28', fontSize: 14 }}>
                                                        {getAgenteByBairro(item.bairro).telefone}
                                                    </Typography>
                                                    <Typography sx={{ fontWeight: 'bold', color: '#006a28', fontSize: 14 }}>
                                                        {getAgenteByBairro(item.bairro).postoCorrespondente}
                                                    </Typography>
                                                    <img
                                                        src={getAgenteByBairro(item.bairro).foto}
                                                        alt={getAgenteByBairro(item.bairro).nome}
                                                        width="90" height="120"
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 10,
                                                            right: 20,
                                                            borderRadius: 2,
                                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </Paper>
                            ))}
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default Home;
