const version = process.version;
console.log(`🚀 Running Node.js ${version}`);

const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');
const todos = [];

const requestListener = (req, res) => {
    console.log('--');
    console.log('Received request for:', req.url);
    console.log('Request method:', req.method);

    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
        'Content-Type': 'application/json'
    };

    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    if (req.url === '/todos' && req.method === 'GET') {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos
        }));
        res.end();
    }
    else if (req.url === '/todos' && req.method === 'POST') {
        req.on('end', () => {
            try {                
                const title = JSON.parse(body).title;

                if (!title) {
                    errorHandle(res);
                    return; // 後面就不需要寫 else 了, 因為已經結束了, 可以減少巢狀
                }

                const newTodo = {
                    id: uuidv4(),
                    title: title,
                };
                todos.push(newTodo);

                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    "status": "success",
                    "data": newTodo // 因為前端只需要知道新增的那一筆, 不需要全部, 回傳全部會增加不必要的流量
                }));
                res.end();
            } catch (error) {
                errorHandle(res);
            }
        });
    }
    else if (req.url === '/todos' && req.method === 'DELETE') {
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos
        }));
        res.end();
    }
    else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
        const id = req.url.split('/').pop();
        const index = todos.findIndex(todo => todo.id === id);

        if (index !== -1) {
            todos.splice(index, 1);

            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "success",
                "data": todos
            }));
            res.end();
        } else {
            errorHandle(res);
        }
    }
    else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
        const id = req.url.split('/').pop();
        const index = todos.findIndex(todo => todo.id === id);

        if (index !== -1) {
            req.on('end', () => {
                try {
                    const title = JSON.parse(body).title;

                    if (!title) {
                        errorHandle(res);
                        return;
                    }

                    todos[index].title = title;

                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos[index]
                    }));
                    res.end();
                } catch (error) {
                    errorHandle(res);
                }
            });
        } else {
            errorHandle(res);
        }
    }
    else if (req.method === 'OPTIONS') {
        // 跨網域使用的預檢請求, 因為前端會先發送 OPTIONS 請求來確認是否允許跨域, 所以這裡直接回應 200 就好
        res.writeHead(200, headers);
        res.end();
    }
    else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
        "status": "failed",
        "message": "Not Found"
        }));        
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(3636, () => {
    console.log('Server running at http://localhost:3636/');
});
