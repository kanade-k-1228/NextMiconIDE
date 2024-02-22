# Next Micon IDE

![](img/ide_home.png)

![](img/ide_hw.png)

![](img/ide_sw.png)

## TODO

- オブジェクトのパラメタ編集
- モジュール内部回路の GUI 表示
- モジュールに対する暗示的な配線（ReactのHook的な）
- オブジェクトの順番入れ替え
- 他のターゲットへの対応
  - `(chip)-(board)-(cpu)-(bus)`
  - [x] `ice40_lp8k-tiny_fpga_bx-picorv32-sram`
  - [ ] `gw1nr9-tang_nano_9k-vex_riscv-wishbone`
  - [ ] `zynq_7010-zybo_z710-arm_coretex_a9-axi_lite`
  - [ ] `caravel-unknown-picorv32-wishbone` ← ASIC!
- 演算子
  - 算術 `+ - * / % **`
  - ビット `~ & | ^ ~^`
  - リダクション `& ~& | ~| ^ ~^`
  - 論理 `! && ||`
  - 比較 `== != < <= > >=`
  - シフト `<< >> <<< >>>`

## MEMO

### 型

- 非構造型 : `wN`
  - ビット幅だけが定義された型
  - ビットの並びに意味はない
- 構造化配線
  - 配線の順序に意味がある
  - 符号なし整数 : `uN`
    - `u1 = [0, 1]`
    - `u2 = [0, 1, 2, 3]`
    - ... `uN`
  - 符号あり整数 : `iN`
    - `i1 = [0, -1]`
    - `i2 = [0, 1, -2, -1]`
    - ... `iN`
  - 浮動小数点数
    - `f16` : IEEE754
    - `f32` : IEEE754
    - `f64` : IEEE754
    - `f8`
    - `bf16`
  - 構造体型
    - `{a: Type, b: Type}`
    - 構造体型の幅はメンバの幅の合計
- 型の適合
  - 配線は両端のポートの型が適合する必要がある
  - 配線幅が同じであること
    - ハードウェア上の最低限の要件
    - 暗黙的な符号拡張などは行わない
- ソフトウェア上の扱い
  - メモリマップされたレジスタには型が定義される
