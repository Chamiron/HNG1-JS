# Number Classification API

This API classifies a given number based on its mathematical properties and returns a fun fact about the number. It provides several features such as identifying Armstrong numbers, checking if a number is prime or perfect, and returning the sum of the digits of the number.

## Features

- **Number Classification**: Identifies Armstrong numbers, even/odd numbers, prime numbers, and perfect numbers.
- **Fun Fact**: Fetches a fun fact related to the number from the Numbers API (or provides a predefined fact for Armstrong numbers like `371`).
- **Digit Sum**: Returns the sum of the digits of the given number.

## Endpoint

### `GET /api/classify-number?number=<number>`

#### Request Parameters:
- `number`: The number to classify. This must be a valid integer.

#### Response:

- **Status 200 OK**: Returns a JSON response with the classification of the number.
- **Status 400 Bad Request**: Returns an error if the input is invalid (e.g., non-numeric input).

### Example Request:
