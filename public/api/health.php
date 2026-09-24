<?php
declare(strict_types=1);

require __DIR__ . '/db.php';

db();
json_response(['status' => 'ok', 'php' => PHP_VERSION]);
