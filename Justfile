# v3.14 is not compatible with higher emscripten version yet
# see https://github.com/emscripten-core/emscripten/issues/26132
# and various use of the emscripten private API in Python/emscripten_syscalls.c
# Use recommended Emscripten version https://devguide.python.org/contrib/workflows/compile/#emscripten
EMSDK_VERSION := "4.0.12"
CPYTHON_VERSION := "v3.14.2"

# https://github.com/emscripten-core/emscripten/tree/main/system/lib/libcxx
LLVM_VERSION := "llvmorg-20.1.8"

dev: install build-deps
    @npx vite

type-check: install
    @npx vue-tsc -b

build: install type-check build-deps
    @npx vite build

preview: install build-deps
    @npx vite preview

lint: install
    @npx eslint --fix src

format: install
    @npx prettier . --write

install:
    @if [ ! -d "node_modules" ]; then \
        npm install; \
    fi

build-deps:
    @make -s -C deps EMSDK_VERSION={{EMSDK_VERSION}} CPYTHON_VERSION={{CPYTHON_VERSION}} LLVM_VERSION={{LLVM_VERSION}}

clean:
    @make -C deps clean
    @rm -rf node_modules
