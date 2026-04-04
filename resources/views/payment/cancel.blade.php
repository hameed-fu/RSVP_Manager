<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Canceled</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f9fb;
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
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }

        .card svg {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
        }

        .card h1 {
            font-size: 1.75rem;
            color: #e11d48; /* red-600 */
            margin-bottom: 0.5rem;
        }

        .card p {
            font-size: 1rem;
            color: #555;
            margin-bottom: 1.5rem;
        }

        .card a {
            text-decoration: none;
            color: #4f46e5;
            font-weight: 600;
        }

        .card a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="card">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke="red">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <h1>Payment Canceled</h1>
        <p>Your payment was canceled. You can try again anytime.</p>
        <a href="/">← Return to Home</a>
    </div>
</body>
</html>
