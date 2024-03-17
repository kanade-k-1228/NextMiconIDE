# !/bin/sh

mkdir -p ~/.NextMiconIDE

# Install NextMiconIDE

VERSION="0.0.0"

curl -fsSL https://github.com/NextMicon/NextMiconIDE/releases/download/$VERSION/NextMiconIDE-$VERSION.AppImage \
     -O ~/.NextMiconIDE/NextMiconIDE-$VERSION.AppImage
chmod 755 ~/.NextMiconIDE/NextMiconIDE-$VERSION.AppImage


# Install OSS Cad Suite

Y="2024"
M="03"
D="14"

curl -fsSL https://github.com/YosysHQ/oss-cad-suite-build/releases/download/$Y-$M-$D/oss-cad-suite-linux-x64-$Y$M$D.tgz \
     -O ~/.NextMiconIDE/oss-cad-suite-linux-x64-$Y$M$D.tgz
tar -zxvf ~/.NextMiconIDE/oss-cad-suite-linux-x64-$Y$M$D.tgz \
    -O ~/.NextMiconIDE/oss-cad-suite


# Install RISC-V GNU Toolchain

sudo apt update
sudo apt install gcc-riscv64-unknown-elf


# mkdir
mkdir -p ~/NextMiconIDE
mkdir -p ~/NextMiconIDE/Target
mkdir -p ~/NextMiconIDE/Package
mkdir -p ~/NextMiconIDE/Project


echo "Please add PATH: export PATH=\$PATH:~/.NextMiconIDE:~/.NextMiconIDE/oss-cad-suite/bin"
