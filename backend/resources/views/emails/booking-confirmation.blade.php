<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <h2>Szia {{ $booking->user->name }}!</h2>

    <p>A foglalásod sikeresen létrejött, az alábbi adatokkal:</p>

    <ul>
        <li><strong>Erőforrás:</strong> {{ $booking->resource->name }}</li>
        <li><strong>Kezdés:</strong> {{ $booking->start_time->format('Y.m.d H:i') }}</li>
        <li><strong>Befejezés:</strong> {{ $booking->end_time->format('Y.m.d H:i') }}</li>
        <li><strong>Státusz:</strong> Jóváhagyásra vár</li>
    </ul>

    <p>Amint egy adminisztrátor jóváhagyja a foglalást, értesítünk!</p>
</body>
</html>