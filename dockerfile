FROM msa02032022/compiler:latest
WORKDIR .
COPY package*.json .
RUN npm install
COPY . ./
EXPOSE 4000
CMD ["npm", "run", "start"]