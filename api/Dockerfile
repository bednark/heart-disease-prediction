FROM python:3.10-alpine

WORKDIR /api

COPY . .

ENV FLASK_ENV=prod
ENV COSMOS_DB=heart-disease-prediction
ENV REDIS_PORT=6380
ENV REDIS_SSL=true

EXPOSE $PORT

RUN pip install -r requirements.txt

ENTRYPOINT [ "python", "main.py" ]