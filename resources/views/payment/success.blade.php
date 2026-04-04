<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Payment Success</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f9;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }

        .card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 450px;
            width: 100%;
        }

        .card svg {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
        }

        .card h1 {
            font-size: 1.8rem;
            color: green;
            margin-bottom: 0.5rem;
        }

        .card p {
            font-size: 0.95rem;
            margin-bottom: 1rem;
            color: #333;
        }

        .card ul {
            text-align: left;
            padding-left: 0;
            list-style: none;
            margin-bottom: 1.2rem;
            color: #444;
        }

        .card ul li {
            margin-bottom: 6px;
        }

        .card a {
            display: inline-block;
            margin-top: 10px;
            color: #4f46e5;
            text-decoration: none;
            font-weight: bold;
        }

        .card a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="card">
        <svg fill="none" stroke="green" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h1>Payment Successful!</h1>
        <p>Success! Your request will be completed shortly.</p>
        {{-- <p><a href="/cpos">Check the status here</a></p>

        <ul>
            <li><strong>Transaction ID:</strong> {{ $activationRequest->transaction ?? 'N/A' }}</li>
            <li><strong>SIM Card Number:</strong> {{ $activationRequest->iccid ?? 'N/A' }}</li>
            <li><strong>Paid Amount:</strong> ${{ number_format($amount_paid ?? 0, 2) }}</li>
        </ul> --}}


        <p>A confirmation email has been sent to your registered email.</p>

        <a href="/">← Return to Home</a>
    </div>
</body>

</html>
