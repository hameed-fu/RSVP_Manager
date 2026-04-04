<?php

// developer account detail
return [

    // Default context (optional)
    'default' => 'purchase',

    'paypal' => [
        'client_id' => env('PAYPAL_CLIENT_ID', 'your-purchase-client-id'),
        'secret' => env('PAYPAL_SECRET', 'your-purchase-secret'),
        'mode' => env('PAYPAL_MODE', 'sandbox'),
    ],

    

    'settings' => [
        'http.ConnectionTimeOut' => 500000,
        'log.LogEnabled' => true,
        'log.FileName' => storage_path('logs/paypal.log'),
        'log.LogLevel' => 'FINE',
    ],
];

// live account detail
// return [
//     'client_id' => 'AUZ3qJchEg8l28U4exEjgiA5DWe4iwga3SJNbPHjEIFChOJrQRM-Fa8P14xZR6ASbB3VMyAWUK0OfLxW',
//     'secret' => 'EKJoDfmntkzNgq0-7qGoGuxrN6a7floKF18bvW3-wzMHIKTFXQ0ua1vSs7zRY0gErQVnRRnh_pyX2SnX',
//     'settings' => array(
//         'mode' => 'live',
//         'http.ConnectionTimeOut' => 500000,
//         'log.LogEnabled' => true,
//         'log.FileName' => storage_path() . '/logs/paypal.log',
//         'log.LogLevel' => 'FINE'
//     ),
// ];
