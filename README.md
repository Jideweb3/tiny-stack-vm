# Tiny Stack VM

A tiny stack virtual machine for make.fun's `tiny-stack-vm-01-run-20261122`
bounty. Runs every program of the contest's 32-bit stack ISA
(`program.bin` + `input.bin`) and writes its output bytes and exit code.

## Run

Node 22, no dependencies:

```sh
node main.ts
```

Reads `/input/<id>/program.bin` and `/input/<id>/input.bin` for each
instance and writes `/output/<id>/stdout.bin` and `/output/<id>/exit.txt`
(`MAKEFUN_INPUT_DIR` / `MAKEFUN_OUTPUT_DIR` override the paths).

## Design

A single-file interpreter: `Int32Array` stack, call stack and memory, a
preallocated output buffer, allocation-free decimal printing, exact
32-bit wrap arithmetic (`Math.imul`), and all ten traps with their exact
exit codes. Practice set: 40/40 correct, 1,000,000 points, ~0.4 s.

## License

MIT — see LICENSE.
