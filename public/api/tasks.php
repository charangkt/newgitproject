<?php
declare(strict_types=1);

require __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;
$input = json_decode(file_get_contents('php://input') ?: '{}', true) ?? [];

function find_task(int $id): array
{
    $stmt = db()->prepare('SELECT * FROM tasks WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        json_response(['error' => 'Task not found'], 404);
    }
    return $row;
}

try {
    switch ($method) {
        case 'GET':
            if ($id !== null) {
                json_response(format_task(find_task($id)));
            }
            $rows = db()->query('SELECT * FROM tasks ORDER BY id DESC')->fetchAll();
            json_response(array_map('format_task', $rows));

        case 'POST':
            $title = trim((string) ($input['title'] ?? ''));
            if ($title === '') {
                json_response(['error' => 'Title is required'], 422);
            }
            if (mb_strlen($title) > 200) {
                json_response(['error' => 'Title must be 200 characters or fewer'], 422);
            }
            $stmt = db()->prepare('INSERT INTO tasks (title) VALUES (?)');
            $stmt->execute([$title]);
            json_response(format_task(find_task((int) db()->lastInsertId())), 201);

        case 'PATCH':
            if ($id === null) {
                json_response(['error' => 'id is required'], 400);
            }
            find_task($id);
            if (array_key_exists('done', $input)) {
                db()->prepare('UPDATE tasks SET done = ? WHERE id = ?')
                    ->execute([$input['done'] ? 1 : 0, $id]);
            }
            if (isset($input['title']) && trim((string) $input['title']) !== '') {
                db()->prepare('UPDATE tasks SET title = ? WHERE id = ?')
                    ->execute([trim((string) $input['title']), $id]);
            }
            json_response(format_task(find_task($id)));

        case 'DELETE':
            if ($id === null) {
                json_response(['error' => 'id is required'], 400);
            }
            find_task($id);
            db()->prepare('DELETE FROM tasks WHERE id = ?')->execute([$id]);
            json_response(['deleted' => $id]);

        default:
            header('Allow: GET, POST, PATCH, DELETE');
            json_response(['error' => 'Method not allowed'], 405);
    }
} catch (Throwable $e) {
    error_log($e->getMessage());
    json_response(['error' => 'Server error'], 500);
}
