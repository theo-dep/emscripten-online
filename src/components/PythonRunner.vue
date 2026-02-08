<script setup lang="ts">
import { ref, onMounted } from "vue";
import pythonUrl from "@python/python.mjs?url";

const emit = defineEmits<{
  (e: "output", output: string): void;
  (e: "error", error: string): void;
  (e: "ready"): void;
}>();

const isReady = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Module: any = null;

const loadPython = async () => {
  try {
    const createEmscriptenModule = (await import(/* @vite-ignore */ pythonUrl))
      .default;

    Module = await createEmscriptenModule({
      noInitialRun: true,
      preRun: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async function (Mod: any) {
          const versionInt = Mod.HEAPU32[Mod._Py_Version >>> 2];
          const major = (versionInt >>> 24) & 0xff;
          const minor = (versionInt >>> 16) & 0xff;

          Mod.FS.mkdirTree(`/lib/python${major}.${minor}/lib-dynload/`);

          Mod.addRunDependency("install-stdlib");
          const zipUrl = (
            await import(`@python/python${major}.${minor}.zip?url`)
          ).default;
          const resp = await fetch(zipUrl);
          const stdlibBuffer = await resp.arrayBuffer();
          Mod.FS.writeFile(
            `/lib/python${major}${minor}.zip`,
            new Uint8Array(stdlibBuffer),
            { canOwn: true },
          );
          Mod.removeRunDependency("install-stdlib");
        },
      ],

      print: (text: string) => {
        emit("output", text);
      },

      printErr: (text: string) => {
        emit("error", text);
      },

      onRuntimeInitialized: () => {
        isReady.value = true;
        emit("ready");
      },
    });
  } catch (error) {
    console.error("Failed to load Python WASM:", error);
    emit("error", `Failed to load Python: ${error}`);
  }
};

const runCode = async (code: string, input?: string) => {
  if (!Module || !isReady.value) {
    emit("error", "Python runtime not ready");
    return;
  }

  try {
    const filename = "/tmp/script.py";
    Module.FS.writeFile(filename, code);

    const args = [filename];
    if (input) {
      args.push(input);
    }

    const ret = Module.callMain(args);
    emit("error", `Script exited with code ${ret}`);
  } catch (error: unknown) {
    if (typeof error === "string") {
      emit("error", error);
    } else if (error instanceof Error) {
      emit("error", error.message);
    }
  }
};

onMounted(() => {
  loadPython();
});

defineExpose({ runCode, isReady });
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template>
  <!-- only runner -->
</template>
