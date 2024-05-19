# TODO

## Web

- GitHub Actions build script
- Install script
- Use GraphQL for IPC
- Online Editor

## Micon Editor

- Parametoric object
- FSM editor
- LUT editor
- Recursive editor
- Implicit wiring
  - Logic analyzer without port
- Linter & Formatter for graph 
- Operator
  - Arith `+ - * / % **`
  - Bit `~ & | ^ ~^`
  - Reduction `& ~& | ~| ^ ~^`
  - Logic `! && ||`
  - Compare `== != < <= > >=`
  - Shift `<< >> <<< >>>`

## Backend

- Compiler server
- Add target board
  - `(target)-(cpu)-(bus)`
  - [x] `tiny_fpga_bx-picorv32-sram`
  - [ ] `tiny_fpga_bx-picorv32-wishbone`
  - [ ] `tiny_fpga_bx-picorv32-axi_lite`
  - [ ] `tiny_fpga_bx-vex_riscv-wishbone`
  - [ ] `tiny_fpga_bx-vex_riscv-axi_lite`
  - [ ] `tang_nano_9k-picorv32-wishbone`
  - [ ] `tang_nano_9k-picorv32-axi_lite`
  - [ ] `tang_nano_9k-vex_riscv-wishbone`
  - [ ] `tang_nano_9k-vex_riscv-axi_lite`
  - [ ] `zybo_z710-arm_coretex_a9-axi_lite`
  - [ ] `caravel-picorv32-wishbone` ← ASIC!

## Type of Wire

**wire**

- `wire[N]` : N-bit wire (Base type)

**int**

- `u<N>` : N-bit unsigned int (ext wN)
- `i<N>` : N-bit int (ext wN)

**float**

- `f16` : IEEE754
- `f32` : IEEE754
- `f64` : IEEE754
- `f8`
- `bf16`
    
**struct**

- `{a: Type, b: Type}`
  - width(type(a)) + width(type(b))

## Type Checker

- 配線は両端のポートの型が適合する必要がある
- 配線幅が同じであること
  - ハードウェア上の最低限の要件
  - 暗黙的な符号拡張などは行わない
- ソフトウェア上の扱い
  - メモリマップされたレジスタには型が定義される
