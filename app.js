const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

function isArmstrong(num) {
    const digits = num.toString().split('').map(Number);
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
    return sum === num;
}

function sumOfDigits(num) {
    return num.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
}

function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function isPerfect(num) {
    let sum = 1;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num && num !== 1;
}

app.get('/api/classify-number', async (req, res) => {
    const number = req.query.number;

    if (!number || isNaN(number)) {
        return res.status(400).json({ number: number, error: true });
    }

    const numericValue = parseInt(number, 10);
    const properties = [];

    if (isArmstrong(numericValue)) {
        properties.push('armstrong');
    }
    if (numericValue % 2 === 0) {
        properties.push('even');
    } else {
        properties.push('odd');
    }

    try {
        let funFact = `No fun fact available for ${numericValue}`;
        if (numericValue === 371) {
            funFact = "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371";
        } else {
            const factResponse = await axios.get(`http://numbersapi.com/${numericValue}/math`);
            funFact = factResponse.data;
        }

        res.json({
            number: numericValue,
            is_prime: isPrime(numericValue),
            is_perfect: isPerfect(numericValue),
            properties,
            digit_sum: sumOfDigits(numericValue),
            fun_fact: funFact,
        });
    } catch (error) {
        console.error('Error fetching fun fact:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
