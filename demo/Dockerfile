FROM debian
RUN apt-get update && apt-get install -y \
    g++ \
    gdb \
    make
COPY examples /examples/
WORKDIR /examples
WORKDIR hello-world
RUN make
WORKDIR /examples
