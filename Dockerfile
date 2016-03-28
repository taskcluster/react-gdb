FROM gdb-test
COPY hello.c /data/test/
WORKDIR /data/test
CMD gcc -g hello.c -o hello
