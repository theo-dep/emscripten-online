EMSDK_VERSION ?= latest
CPYTHON_VERSION ?= main

LLVM_VERSION ?= main

EMSDK_GIT = https://github.com/emscripten-core/emsdk.git
EMSDK_SRC = $(shell pwd)/emsdk
EMSCRIPTEN_SRC = $(EMSDK_SRC)/upstream/emscripten

CPYTHON_GIT = https://github.com/python/cpython.git
CPYTHON_SRC = $(shell pwd)/cpython
CPYTHON_BUILD = $(CPYTHON_SRC)/cross-build/build
CPYTHON_HOST = $(CPYTHON_SRC)/cross-build/wasm32-emscripten/build/python
LIB_DIR = $(CPYTHON_SRC)/cross-build/wasm32-emscripten/prefix/lib

LLVM_GIT = https://github.com/llvm/llvm-project.git
LLVM_SRC = $(shell pwd)/llvm
LLVM_NATIVE_BUILD = $(LLVM_SRC)/cross-build/native-llvm
LLVM_WASM_BUILD = $(LLVM_SRC)/cross-build/wasm-llvm

WITH_EMSDK = bash $(shell pwd)/sourceEmsdkThenExec.sh

all: python llvm

python: $(CPYTHON_HOST)/python.wasm

llvm: $(LLVM_WASM_BUILD)/bin/clang.wasm $(LLVM_WASM_BUILD)/bin/lld.wasm

clean:
	-git -C $(CPYTHON_SRC) clean -ffdx
	-git -C $(EMSDK_SRC) clean -ffdx
	-git -C $(LLVM_SRC) clean -ffdx

.PHONY: all python llvm clean

# cpython
# ------------------------------------

$(CPYTHON_HOST)/python.wasm: | $(CPYTHON_HOST)/Makefile
	@echo "Building host..."
	$(WITH_EMSDK) python3 $(CPYTHON_SRC)/Tools/wasm/emscripten make-host

$(CPYTHON_HOST)/Makefile: | $(LIB_DIR)/libffi.a $(LIB_DIR)/libmpdec.a
	@echo "Configuring host..."
	$(WITH_EMSDK) python3 $(CPYTHON_SRC)/Tools/wasm/emscripten configure-host

$(LIB_DIR)/libmpdec.a: | $(CPYTHON_BUILD)/python $(EMSDK_SRC)/.emscripten
	@echo "Building mpdecimal..."
	$(WITH_EMSDK) python3 $(CPYTHON_SRC)/Tools/wasm/emscripten make-mpdec

$(LIB_DIR)/libffi.a: | $(CPYTHON_BUILD)/python $(EMSDK_SRC)/.emscripten
	@echo "Building libffi..."
	$(WITH_EMSDK) python3 $(CPYTHON_SRC)/Tools/wasm/emscripten make-libffi

$(CPYTHON_BUILD)/python: | $(CPYTHON_BUILD)/Makefile
	@echo "Building cpython..."
	python3 $(CPYTHON_SRC)/Tools/wasm/emscripten make-build-python

$(CPYTHON_BUILD)/Makefile: | $(CPYTHON_SRC)/Tools/wasm/emscripten
	@echo "Configuring cpython build..."
	python3 $(CPYTHON_SRC)/Tools/wasm/emscripten configure-build-python

$(CPYTHON_SRC)/Tools/wasm/emscripten:
	@echo "Cloning cpython (version: $(CPYTHON_VERSION))..."
	git clone --branch $(CPYTHON_VERSION) --depth 1 $(CPYTHON_GIT) $(CPYTHON_SRC)

# emsdk
# ------------------------------------

$(EMSDK_SRC)/.emscripten: | $(EMSCRIPTEN_SRC)/emcc
	@echo "Activating emsdk (version: $(EMSDK_VERSION))..."
	$(EMSDK_SRC)/emsdk activate $(EMSDK_VERSION)

$(EMSCRIPTEN_SRC)/emcc: | $(EMSDK_SRC)/emsdk
	@echo "Installing emsdk (version: $(EMSDK_VERSION))..."
	$(EMSDK_SRC)/emsdk install $(EMSDK_VERSION)

$(EMSDK_SRC)/emsdk:
	@echo "Cloning emsdk..."
	git clone $(EMSDK_GIT) $(EMSDK_SRC)

# llvm
# ------------------------------------

$(LLVM_WASM_BUILD)/bin/clang.wasm $(LLVM_WASM_BUILD)/bin/lld.wasm: | $(LLVM_WASM_BUILD)/CMakeCache.txt
	@echo "Building wasm clang..."
	$(WITH_EMSDK) cmake --build $(LLVM_WASM_BUILD) --target clang lld

$(LLVM_WASM_BUILD)/CMakeCache.txt: | $(LLVM_NATIVE_BUILD)/bin/llvm-tblgen $(LLVM_NATIVE_BUILD)/bin/clang-tblgen
	@echo "Configuring wasm clang..."
	$(WITH_EMSDK) emcmake cmake -G Ninja \
		-S $(LLVM_SRC)/llvm \
		-B $(LLVM_WASM_BUILD) \
		-DCMAKE_EXE_LINKER_FLAGS="-sNO_FILESYSTEM -sSTANDALONE_WASM" \
		-DCMAKE_BUILD_TYPE=Release \
		-DLLVM_TARGETS_TO_BUILD=WebAssembly \
		-DLLVM_ENABLE_PROJECTS="clang;lld" \
		-DLLVM_ENABLE_DUMP=OFF \
		-DLLVM_ENABLE_ASSERTIONS=OFF \
		-DLLVM_ENABLE_EXPENSIVE_CHECKS=OFF \
		-DLLVM_ENABLE_BACKTRACES=OFF \
		-DLLVM_BUILD_TOOLS=OFF \
		-DLLVM_ENABLE_THREADS=OFF \
		-DLLVM_BUILD_LLVM_DYLIB=OFF \
		-DLLVM_INCLUDE_TESTS=OFF \
		-DLLVM_INCLUDE_EXAMPLES=OFF \
		-DLLVM_TABLEGEN=$(LLVM_NATIVE_BUILD)/bin/llvm-tblgen \
		-DCLANG_TABLEGEN=$(LLVM_NATIVE_BUILD)/bin/clang-tblgen

$(LLVM_NATIVE_BUILD)/bin/llvm-tblgen $(LLVM_NATIVE_BUILD)/bin/clang-tblgen: | $(LLVM_NATIVE_BUILD)/CMakeCache.txt
	@echo "Building native llvm-tblgen and clang-tblgen..."
	cmake --build $(LLVM_NATIVE_BUILD) --target llvm-tblgen clang-tblgen

$(LLVM_NATIVE_BUILD)/CMakeCache.txt: | $(LLVM_SRC)/llvm/CMakeLists.txt
	@echo "Configuring native llvm..."
	cmake -G Ninja \
		-S $(LLVM_SRC)/llvm \
		-B $(LLVM_NATIVE_BUILD) \
		-DCMAKE_BUILD_TYPE=Release \
		-DLLVM_TARGETS_TO_BUILD=WebAssembly \
		-DLLVM_ENABLE_PROJECTS="clang"

$(LLVM_SRC)/llvm/CMakeLists.txt:
	@echo "Cloning llvm..."
	git clone --branch $(LLVM_VERSION) --depth 1 $(LLVM_GIT) $(LLVM_SRC)
