# Version: 0.0.1

FROM ubuntu:16.04
MAINTAINER Perfectura <mail@perfectura.ru>
RUN apt-get update
RUN apt-get install -y nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY sites_common.conf /etc/include.d/sites_common.conf
COPY maintenance_common.conf /etc/include.d/maintenance_common.conf
COPY sites-available/ /etc/nginx/sites-available
RUN ["ln", "-s", "/etc/nginx/sites-available/project", "/etc/nginx/sites-enabled/project"]
RUN ["rm", "-rf", "/etc/nginx/sites-enabled/default"]
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]