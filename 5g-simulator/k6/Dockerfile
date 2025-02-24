FROM grafana/k6:latest

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/data

COPY data/* /usr/src/app/data/
COPY *.js /usr/src/app/


ENTRYPOINT ["k6", "run", "--out", "influxdb=http://influxdb:8086/k6", "/usr/src/app/test.js"]