.PHONY: all generate lint format clean

all: lint generate

generate:
	buf generate proto

lint:
	buf lint proto

format:
	buf format -w proto

clean:
	rm -rf gen
