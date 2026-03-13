FROM nginx:alpine
COPY public/ /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
