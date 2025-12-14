const { spawn } = require('child_process');
const path = require('path');

// Configuration for processes
const processes = [
    {
        name: 'Backend',
        command: 'npx',
        args: ['nodemon', 'server'],
        cwd: path.join(__dirname, 'backend'),
        color: '\x1b[32m', // Green
    },
    {
        name: 'Ngrok',
        command: 'ngrok',
        args: ['http', '--url=mullet-deep-explicitly.ngrok-free.app', '3000'],
        cwd: path.join(__dirname, 'backend'),
        color: '\x1b[36m', // Cyan
    },
    {
        name: 'Expo',
        command: 'npm',
        args: ['run', 'start:app'],
        cwd: __dirname,
        color: '\x1b[35m', // Magenta
        stdio: 'inherit', // Let Expo take over stdin/stdout for interactivity
    },
];

const children = [];

// Helper to spawn process
processes.forEach((proc) => {
    console.log(`${proc.color}[${proc.name}] Starting...${'\x1b[0m'}`);

    const child = spawn(proc.command, proc.args, {
        cwd: proc.cwd,
        shell: true,
        stdio: proc.stdio || 'pipe',
    });

    children.push(child);

    // Handle stdout
    if (child.stdout) {
        child.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            lines.forEach((line) => {
                if (line.trim()) {
                    console.log(`${proc.color}[${proc.name}] ${line.trim()}${'\x1b[0m'}`);
                }
            });
        });
    }

    // Handle stderr
    if (child.stderr) {
        child.stderr.on('data', (data) => {
            const lines = data.toString().split('\n');
            lines.forEach((line) => {
                if (line.trim()) {
                    console.error(`${proc.color}[${proc.name}] ${line.trim()}${'\x1b[0m'}`);
                }
            });
        });
    }

    // Handle exit
    child.on('close', (code) => {
        console.log(`${proc.color}[${proc.name}] Exited with code ${code}${'\x1b[0m'}`);
        cleanup();
    });
});

function cleanup() {
    console.log('\nCleaning up processes...');
    children.forEach(child => {
        try {
            // Check if process is still connected/running
            if (child.pid) {
                // Windows specific kill for shell-spawned processes
                if (process.platform === 'win32') {
                    spawn('taskkill', ['/pid', child.pid, '/f', '/t']);
                } else {
                    child.kill();
                }
            }
        } catch (e) {
            // Ignore errors
        }
    });

    // Explicitly exit after a brief pause to allow cleanup
    setTimeout(() => {
        process.exit(0);
    }, 100);
}

// Handle global exit
process.on('SIGINT', () => {
    cleanup();
});

// Handle termination signals
process.on('SIGTERM', () => {
    cleanup();
});
