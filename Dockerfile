FROM registry.access.redhat.com/ubi9/nodejs-22:latest AS build
USER root
RUN command -v yarn || npm i -g yarn

ADD . /usr/src/app
WORKDIR /usr/src/app
RUN yarn install && yarn build

FROM registry.access.redhat.com/ubi9/ubi-minimal:latest

RUN microdnf -y install --setopt=tsflags=nodocs nginx && \
    microdnf clean all

RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log && \
    sed -i 's~/run/nginx.pid~/var/cache/nginx/nginx.pid~g' /etc/nginx/nginx.conf && \
    sed -i -e '/user/!b' -e '/nginx/!b' -e '/nginx/d' /etc/nginx/nginx.conf && \
    sed -i -e 's/listen       80;/listen       8080;/g' -e 's/listen       \[::]:80;/listen       [::]:8080;/g' /etc/nginx/nginx.conf && \
    mkdir -p /var/cache/nginx && \
    chown -R 1001:0 /var/cache/nginx /etc/nginx /var/log/nginx /usr/share/nginx/html && \
    chmod -R g=u /var/cache/nginx /etc/nginx /var/log/nginx /usr/share/nginx/html

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
USER 1001

ENTRYPOINT ["nginx", "-g", "daemon off;"]