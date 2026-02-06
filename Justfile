EMSDK_VERSION := "4.0.12"
CPYTHON_VERSION := "v3.14.2"

dev: install build-cpython
    @npx vite

type-check: install
    @npx vue-tsc -b

build: install type-check build-cpython
    @npx vite build

preview: install build-cpython
    @npx vite preview

lint: install
    @npx eslint --fix src

format: install
    @npx prettier . --write

install:
    @if [ ! -d "node_modules" ]; then \
        npm install; \
    fi

build-cpython:
    @make -s -C deps python EMSDK_VERSION={{EMSDK_VERSION}} CPYTHON_VERSION={{CPYTHON_VERSION}}

clean:
    @make -C deps clean
    @rm -rf node_modules
