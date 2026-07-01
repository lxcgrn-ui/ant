const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function advancedObfuscate(sourceCode) {
    const base64Str = Buffer.from(encodeURIComponent(sourceCode)).toString('base64');
    const chunks = [];
    for (let i = 0; i < base64Str.length; i += 12) {
        chunks.push(base64Str.slice(i, i + 12));
    }
    const jsonArray = JSON.stringify(chunks);
    
    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<title>Protected Matrix Page</title>
<script>
window.addEventListener('DOMContentLoaded', () => {
    const dataMatrix = ${jsonArray};
    try {
        const raw = dataMatrix.join('');
        const parsed = decodeURIComponent(atob(raw).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        document.open();
        document.write(parsed);
        document.close();
    } catch(e) {}
});
</script>
</head>
<body></body>
</html>`;
}

app.post('/api/encrypt', (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Invalid' });
    return res.json({ result: advancedObfuscate(code) });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
