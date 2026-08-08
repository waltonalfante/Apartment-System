<?php
$errno = 0;
$errstr = '';

foreach ([587, 465] as $port) {
    $target = $port === 587 ? 'tcp://smtp.gmail.com:587' : 'ssl://smtp.gmail.com:465';
    $fp = @stream_socket_client($target, $errno, $errstr, 10);

    if ($fp) {
        echo $target . '=ok' . PHP_EOL;
        fclose($fp);
        continue;
    }

    echo $target . '=fail ' . $errno . ' ' . $errstr . PHP_EOL;
}
