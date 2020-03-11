FROM node:12-slim

# See https://crbug.com/795759
RUN apt-get update && apt-get install -yq libgconf-2-4 gnupg2 apt-utils wget curl

ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
  google-chrome-unstable

RUN apt-get update && apt-get install -y --no-install-recommends \
  fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont fonts-dejavu \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get purge --auto-remove -y \
  && rm -rf /src/*.deb

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

WORKDIR /app

COPY package.json .
RUN yarn install

RUN groupadd -r pptruser \
  && useradd -r -g pptruser -G audio,video pptruser \
  && mkdir -p /home/pptruser \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /app

USER pptruser

COPY --chown=pptruser:pptruser . /app

RUN yarn build

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
