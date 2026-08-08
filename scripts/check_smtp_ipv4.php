<?php
$targets = [
    'tcp://64.233.188.109:587',
    'ssl://64.233.188.109:465',
];

foreach ($targets as $target) {
    $errno = 0;
    $errstr = '';
    $fp = @stream_socket_client($target, $errno, $errstr, 10);

    if ($fp) {
        echo $target . '=ok' . PHP_EOL;
        fclose($fp);
        continue;
    }

    echo $target . '=fail ' . $errno . ' ' . $errstr . PHP_EOL;
}
