FROM python:3.10-alpine

WORKDIR /api

COPY . .

ENV FLASK_ENV=prod
ENV PROTOCOL=http
ENV HOST=localhost
ENV PORT=8080
ENV REDIS_PORT=6380
ENV REDIS_SSL=true
ENV COSMOS_DB=heart-diesease-prediction

EXPOSE $PORT

RUN pip install -r requirements.txt

ENTRYPOINT [ "python", "main.py" ]