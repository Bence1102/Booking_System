<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <h2>Szia {{ $booking->user->name }}!</h2>

    @if ($booking->status === 'confirmed')
        <p>Örömmel értesítünk, hogy a foglalásod <strong>jóváhagyásra került</strong>:</p>
    @else
        <p>Sajnálattal értesítünk, hogy a foglalásod <strong>elutasításra került</strong>:</p>
    @endif

    <ul>
        <li><strong>Erőforrás:</strong> {{ $booking->resource->name }}</li>
        <li><strong>Kezdés:</strong> {{ $booking->start_time->format('Y.m.d H:i') }}</li>
        <li><strong>Befejezés:</strong> {{ $booking->end_time->format('Y.m.d H:i') }}</li>
    </ul>

    @if ($booking->status !== 'confirmed')
        <p>Ha kérdésed van, vagy más időpontot szeretnél foglalni, nézz szét az elérhető erőforrások között.</p>
    @endif
</body>
</html>