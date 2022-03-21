const express = require('express');
const path = require('path');
const { getPublicToken } = require('./services/forge.js');
const { listSuppliers, listStockLevels, listDeliveryOptions } = require('./services/sap.js');
const { FORGE_MODEL_URN, PORT } = require('./config.js');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.get('/config.json', (req, res) => {
    res.json({ FORGE_MODEL_URN });
});
app.get('/api/auth/token', async function(req, res, next) {
    try {
        const token = await getPublicToken();
        res.json(token);
    } catch(err) {
        next(err);
    }
});
app.get('/api/procurement/suppliers', async function(req, res, next) {
    try {
        const suppliers = await listSuppliers(req.query.part);
        res.json(suppliers);
    } catch (err) {
        next(err);
    }
});
app.get('/api/procurement/suppliers/availability', async function(req, res, next) {
    try {
        const stockLevels = await listStockLevels(req.query.part);
        res.json(stockLevels);
    } catch (err) {
        next(err);
    }
});
app.get('/api/procurement/delivery/options', async function(req, res, next) {
    try {
        const deliveryOptions = await listDeliveryOptions();
        res.json(deliveryOptions);
    } catch (err) {
        next(err);
    }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
