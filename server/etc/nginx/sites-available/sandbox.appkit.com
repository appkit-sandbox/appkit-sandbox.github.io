
server {
    server_name sandbox.appkit.com;

    access_log /var/log/nginx/sandbox.appkit.com.access.log rt_cache;
    error_log /var/log/nginx/sandbox.appkit.com.error.log;

    root /var/www/sandbox.appkit.com/htdocs;
    index index.php index.html index.htm;

    include common/wpsc-php74.conf;
    
    include common/wpcommon-php74.conf;
    include common/locations-wo.conf;
    include /var/www/sandbox.appkit.com/conf/nginx/*.conf;
}
