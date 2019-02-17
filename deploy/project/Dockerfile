# Version: 0.0.1

FROM python:3.7
MAINTAINER Perfectura <mail@perfectura.ru>
ENV DEBIAN_FRONTEND noninteractive
RUN pip install uwsgi
ADD ./deploy/project/uwsgi.ini /
ADD ./requirements.txt /
RUN pip install -r /requirements.txt