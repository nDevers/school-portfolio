module.exports = {
    apps: [
        {
            name: 'school-portfolio',
            script: 'npm',
            args: 'start',
            instances: 1,
            autorestart: true,
            exec_mode: 'cluster',
            watch: true,
            time: true,
            max_memory_restart: '500M',
            restart_delay: 3000,
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};
