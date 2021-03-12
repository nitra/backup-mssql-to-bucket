FROM  fabiang/sqlcmd

RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install nodejs with yarn
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y \
    nodejs \
    yarn \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENTRYPOINT [ "bash" ]