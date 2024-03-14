# !/bin/sh

# Install NextMiconIDE

VER="0.0.0"

curl -fsSL https://github.com/NextMicon/NextMiconIDE/releases/download/$VER/NextMiconIDE-$VER.AppImage -O
chmod 755 NextMiconIDE-$VER.AppImage


# Install OSS Cad Suite

Y="2024"
M="03"
D="14"

curl -fsSL https://github.com/YosysHQ/oss-cad-suite-build/releases/download/$Y-$M-$D/oss-cad-suite-linux-x64-$Y$M$D.tgz -O
tar -zxvf oss-cad-suite-linux-x64-$Y$M$D.tgz


# Install RISC-V GNU Toolchain

sudo apt update
sudo apt install gcc-riscv64-unknown-elf
