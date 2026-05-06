FROM nginx:1.27-alpine
COPY app/index.html /usr/share/nginx/html/index.html
EXPOSE 8080
CMD ["sh", "-c", "sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
