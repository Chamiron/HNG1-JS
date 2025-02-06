const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const cache = new Map();

const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
};

const isArmstrong = (n) => {
    const digits = Math.abs(n).toString().split('').map(Number);
    return digits.reduce((acc, digit) => acc + Math.pow(digit, digits.length), 0) === Math.abs(n);
};

const isPerfect = (n) => {
    if (n < 2) return false;
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            sum += i + (i !== n / i ? n / i : 0);
        }
    }
    return sum === n;
};

app.get('/api/classify-number', async (req, res) => {
    const number = req.query.number;

    if (isNaN(number)) {
        return res.status(400).json({ number, error: true });
    }

    const num = parseInt(number);
    const digitSum = Math.abs(num).toString().split('').reduce((acc, digit) => acc + Number(digit), 0);

    let properties = [];
    if (isArmstrong(num)) properties.push('armstrong');
    if (isPerfect(num)) properties.push('perfect');
    if (isPrime(num)) properties.push('prime');
    properties.push(num % 2 === 0 ? 'even' : 'odd');

    try {
        if (cache.has(num)) {
            return res.json(cache.get(num));
        }

        const funFactResponse = await axios.get(`http://numbersapi.com/${num}/math?json`, { timeout: 3000 });

        const responseData = {
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties,
            digit_sum: digitSum,
            fun_fact: funFactResponse.data.text
        };

        cache.set(num, responseData);

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fun fact' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
