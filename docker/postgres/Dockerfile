FROM postgres:18.3

# Installazione locales
RUN apt-get update && apt-get install -y locales \
    && sed -i -e 's/# it_IT.UTF-8 UTF-8/it_IT.UTF-8 UTF-8/' /etc/locale.gen \
    && locale-gen

# Variabili d'ambiente per il sistema operativo
ENV LANG it_IT.UTF-8
ENV LC_ALL it_IT.UTF-8