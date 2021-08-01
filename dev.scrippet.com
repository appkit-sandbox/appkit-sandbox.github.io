
server {


    server_name dev.scrippet.com www.dev.scrippet.com;


    access_log /var/log/nginx/dev.scrippet.com.access.log rt_cache;
    error_log /var/log/nginx/dev.scrippet.com.error.log;


    root /var/www/dev.scrippet.com/htdocs;

    index index.php index.html index.htm;


    include common/wpsc-php74.conf;
    
    include common/wpcommon-php74.conf;
    include common/locations-wo.conf;
    include /var/www/dev.scrippet.com/conf/nginx/*.conf;

}
