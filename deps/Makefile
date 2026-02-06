EMSDK_VERSION ?= latest
CPYTHON_VERSION ?= main

EMSDK_GIT = https://github.com/emscripten-core/emsdk.git
EMSDK_SRC = $(shell pwd)/emsdk

CPYTHON_GIT = https://github.com/python/cpython.git
CPYTHON_SRC = $(shell pwd)/cpython
CPYTHON_BUILD = $(CPYTHON_SRC)/cross-build/build
CPYTHON_HOST = $(CPYTHON_SRC)/cross-build/wasm32-emscripten/build/python
LIB_DIR = $(CPYTHON_SRC)/cross-build/wasm32-emscripten/prefix/lib

WITH_EMSDK = bash $(shell pwd)/sourceEmsdkThenExec.sh

all: python

python: \
	$(CPYTHON_HOST)/python.wasm

$(CPYTHON_HOST)/python.wasm: | $(CPYTHON_HOST)/.configured
	@echo "Building host..."
	$(WITH_EMSDK) python3 "$(CPYTHON_SRC)/Tools/wasm/emscripten" make-host

$(CPYTHON_HOST)/.configured: | $(LIB_DIR)/libffi.a $(LIB_DIR)/libmpdec.a
	@echo "Configuring host..."
	$(WITH_EMSDK) python3 "$(CPYTHON_SRC)/Tools/wasm/emscripten" configure-host
	@touch $@

$(LIB_DIR)/libmpdec.a: | $(CPYTHON_BUILD)/python $(EMSDK_SRC)/.activated
	@echo "Building mpdecimal..."
	$(WITH_EMSDK) python3 "$(CPYTHON_SRC)/Tools/wasm/emscripten" make-mpdec

$(LIB_DIR)/libffi.a: | $(CPYTHON_BUILD)/python $(EMSDK_SRC)/.activated
	@echo "Building libffi..."
	$(WITH_EMSDK) python3 "$(CPYTHON_SRC)/Tools/wasm/emscripten" make-libffi

$(CPYTHON_BUILD)/python: | $(CPYTHON_BUILD)/.configured
	@echo "Building cpython..."
	python3 "$(CPYTHON_SRC)/Tools/wasm/emscripten" make-build-python

$(CPYTHON_BUILD)/.configured: | $(CPYTHON_SRC)/.git
	@echo "Configuring cpython build..."
	python3 "$(CPYTHON_SRC)/Tools/wasm/emscripten" configure-build-python
	@touch $@

$(CPYTHON_SRC)/.git:
	@echo "Cloning cpython (version: $(CPYTHON_VERSION))..."
	git clone --branch $(CPYTHON_VERSION) --depth 1 $(CPYTHON_GIT) $(CPYTHON_SRC)
	@touch $@

$(EMSDK_SRC)/.activated: | $(EMSDK_SRC)/.installed
	@echo "Activating emsdk (version: $(EMSDK_VERSION))..."
	$(EMSDK_SRC)/emsdk activate $(EMSDK_VERSION)
	@touch $@

$(EMSDK_SRC)/.installed: | $(EMSDK_SRC)/.git
	@echo "Installing emsdk (version: $(EMSDK_VERSION))..."
	$(EMSDK_SRC)/emsdk install $(EMSDK_VERSION)
	@touch $@

$(EMSDK_SRC)/.git:
	@echo "Cloning emsdk..."
	git clone $(EMSDK_GIT) $(EMSDK_SRC)
	@touch $@

clean:
	-git -C $(CPYTHON_SRC) clean -ffdx
	-git -C $(EMSDK_SRC) clean -ffdx
