FROM debian
RUN apt-get update && apt-get install -y \
    g++ \
    gdb \
    make
COPY examples /examples/
WORKDIR /examples
RUN make -C hello-world
RUN make -C guess-game
