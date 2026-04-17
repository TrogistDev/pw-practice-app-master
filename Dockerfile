FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR '/app'

COPY ./package.json ./

RUN npm install --force

COPY . ./

CMD ["npx" ,"playwright" ,"install"]
