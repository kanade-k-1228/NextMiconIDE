import { Obj } from "~/types";
import { Wire, eqPortKey, wireName } from "~/web/1_type";
import { cpp } from "./3_cppGen";
import { VInstance, VWire, verilog } from "./2_verilogGen";
import { ObjResolveExt } from "../3_selector/1_obj";
import { hex } from "~/web/0_common";

// ------------------------------------------------------------------------------------------------
// 置換リスト

export const genReplace = (objs: Obj<ObjResolveExt>[], wires: Wire[]): Record<string, string> => {
  return {
    includes: genIncludes(objs),
    declarations: genDeclarations(objs),
    definitions: genDefinitions(objs),
    iopin: genIOPort(objs),
    iobuffer: genIOBuffer(objs, wires),
    irq: genIRQ(objs, wires),
    instances: genObjects(objs, wires),
    mem_ready: genMemReady(objs),
    mem_rdata: genMemRdata(objs),
  };
};

// ------------------------------------------------------------------------------------------------
// ファームウェア

// TODO 依存関係解決と重複除去

const genIncludes = (objs: Obj<ObjResolveExt>[]) =>
  objs
    .flatMap((obj) => {
      if (obj.obj === "Inst" && obj.addr) return [cpp.include(`${obj.mod.join("/")}/${obj.mod[1]}.hpp`)];
      return [];
    })
    .join("\n");

const genDeclarations = (objs: Obj<ObjResolveExt>[]) =>
  objs
    .flatMap((obj) => {
      if (obj.obj === "Inst" && obj.addr) return [cpp.declaration(obj.mod[1], obj.name)];
      if (obj.obj === "Mem" && obj.variant === "Read") return [cpp.declaration("MemRead", obj.name)];
      if (obj.obj === "Mem" && obj.variant === "Write") return [cpp.declaration("MemWrite", obj.name)];
      return [];
    })
    .join("\n");

const genDefinitions = (objs: Obj<ObjResolveExt>[]) =>
  objs
    .flatMap((obj) => {
      if (obj.obj === "Inst" && obj.addr) {
        return [cpp.instantiation(obj.mod[1], obj.name, `(volatile uint32_t*)0x${hex(obj.addr, 2)}00'0000`)];
      } else if (obj.obj === "Mem" && obj.variant === "Read") {
        return [cpp.instantiation("MemRead", obj.name, `(volatile uint32_t*)0x${hex(obj.addr, 2)}00'0000`)];
      } else if (obj.obj === "Mem" && obj.variant === "Write") {
        return [cpp.instantiation("MemWrite", obj.name, `(volatile uint32_t*)0x${hex(obj.addr, 2)}00'0000`)];
      } else return [];
    })
    .join("\n");

// ------------------------------------------------------------------------------------------------
// ハードウェア

const genIOPort = (objs: Obj<ObjResolveExt>[]) => {
  return objs
    .flatMap((obj) => {
      if (obj.obj === "Port") {
        if (obj.variant === "In") return [`    input  ${name}`];
        if (obj.variant === "Out") return [`    inout  ${name}`];
        if (obj.variant === "InOut") return [`    output ${name}`];
      }
      return [];
    })
    .join(",\n");
};

const genIOBuffer = (objs: Obj<ObjResolveExt>[], wires: Wire[]) => {
  return objs
    .flatMap((obj) => {
      if (obj.obj === "Port") {
        if (obj.variant === "InOut") {
          // IOSEL に接続されているワイヤを探す
          const ioselWire = wires.find((wire) => eqPortKey(wire.last, [obj.name, "iosel"]));
          if (!ioselWire) {
            console.error(`Open Port: ${obj.name}.iosel`);
            return [];
          }
          // OUT に接続されているワイヤを探す
          const outWire = wires.find((wire) => eqPortKey(wire.last, [obj.name, "out"]));
          if (!outWire) {
            console.error(`Open Port: ${obj.name}.out`);
            return [];
          }
          // IN に接続されているワイヤを定義する
          const inWire = verilog.wire({ name: wireName([obj.name, "in"]), width: 1 });
          // IOバッファの生成
          const iobuf = verilog.instance({
            module: "PortInOut",
            instance: `${obj.name}_iobuf`,
            params: [],
            ioport: [
              { port: "pin", wire: obj.name },
              { port: "iosel", wire: wireName(ioselWire.first) },
              { port: "out", wire: wireName(outWire.first) },
              { port: "in", wire: wireName([obj.name, "in"]) },
            ],
          });
          return [iobuf, inWire];
        } else if (obj.variant === "In") {
          // IN に接続されているワイヤを定義する
          const inWire = verilog.wire({ name: wireName([obj.name, "out"]), width: 1 });
          // IOバッファの生成
          const iobuf = verilog.instance({
            module: "PortIn",
            instance: `${obj.name}_iobuf`,
            params: [],
            ioport: [
              { port: "pin", wire: obj.name },
              { port: "out", wire: wireName([obj.name, "out"]) },
            ],
          });
          return [iobuf, inWire];
        } else if (obj.variant === "Out") {
          // OUT に接続されているワイヤを探す
          const outWire = wires.find((wire) => eqPortKey(wire.last, [obj.name, "in"]));
          if (!outWire) {
            console.error(`Open Port: ${obj.name}.in`);
            return [];
          }
          // IO バッファの生成
          const iobuf = verilog.instance({
            module: "PortOut",
            instance: `${obj.name}_iobuf`,
            params: [],
            ioport: [
              { port: "pin", wire: obj.name },
              { port: "in", wire: wireName(outWire.first) },
            ],
          });
          return [iobuf];
        }
      } else return [];
    })
    .join("\n");
};

const genIRQ = (objs: Obj<ObjResolveExt>[], wires: Wire[]) => {
  return objs
    .flatMap((obj) => {
      if (obj.obj === "Irq") {
        const irqWire = wires.find((wire) => eqPortKey(wire.last, [obj.name, "in"]));
        if (!irqWire) {
          console.error(`Open Port: ${obj.name}.in`);
          return [];
        }
        const irqNo = obj.name.slice(3);
        return [`      irq[${irqNo}] = ${wireName(irqWire.first)};`];
      } else return [];
    })
    .join("\n");
};

// --------------------------------------------------------------------------------
// Bus

const genMemReady = (objs: Obj<ObjResolveExt>[]) =>
  objs.flatMap((obj) => (obj.obj === "Mem" || (obj.obj === "Inst" && obj.addr !== undefined) ? [`, ${obj.name}_ready`] : [])).join("");

const genMemRdata = (objs: Obj<ObjResolveExt>[]) =>
  objs
    .flatMap((obj) =>
      obj.obj === "Mem" || (obj.obj === "Inst" && obj.addr !== undefined) ? [`: ${obj.name}_ready ? ${obj.name}_rdata`] : [],
    )
    .join("");

// --------------------------------------------------------------------------------

const genCommonPorts = () => {
  return [
    { port: "clk", wire: "clk" },
    { port: "resetn", wire: "resetn" },
  ];
};

const genBusPorts = (name: string) => {
  return [
    { port: "valid", wire: `${name}_valid` },
    { port: "ready", wire: `${name}_ready` },
    { port: "wstrb", wire: `${name}_valid ? mem_wstrb : 4'b0` },
    { port: "addr", wire: "mem_addr" },
    { port: "wdata", wire: "mem_wdata" },
    { port: "rdata", wire: `${name}_rdata` },
  ];
};

const genBusWires = (name: string, addr: number) => {
  return [
    { name: `${name}_sel`, width: 1, init: `mem_addr[31:24] == 8'h${hex(addr, 2)}` },
    { name: `${name}_valid`, width: 1, init: `mem_valid && ${name}_sel` },
    { name: `${name}_ready`, width: 1 },
    { name: `${name}_rdata`, width: 32 },
  ];
};

// --------------------------------------------------------------------------------

const genObjects = (objs: Obj<ObjResolveExt>[], wires: Wire[]) => {
  return objs
    .flatMap((obj) => {
      if (obj.obj === "Mem") {
        if (obj.variant === "Read") {
          const inWire = wires.find((wire) => eqPortKey(wire.last, [obj.name, "in"]));
          if (inWire) {
            return [
              verilog.instance({
                instance: obj.name,
                module: "MemRead",
                ioport: [...genCommonPorts(), ...genBusPorts(obj.name), { port: "in", wire: wireName(inWire.first) }],
                params: [],
              }),
              ...genBusWires(obj.name, obj.addr).map(verilog.wire),
            ].join("\n");
          } else {
            console.log(`Open port: ${obj.name}.in`);
          }
        }
        if (obj.variant === "Write") {
          const outWire = verilog.wire({ name: wireName([obj.name, "out"]), width: 1 });
          return [
            verilog.instance({
              instance: obj.name,
              module: "MemWrite",
              ioport: [...genCommonPorts(), ...genBusPorts(obj.name), { port: "out", wire: wireName([obj.name, "out"]) }],
              params: [],
            }),
            ...genBusWires(obj.name, obj.addr).map(verilog.wire),
            outWire,
          ].join("\n");
        }
      }
      if (obj.obj === "Inst") {
        let vwires: VWire[] = [];
        let vinst: VInstance = {
          instance: obj.name,
          module: obj.pack.name,
          ioport: [...genCommonPorts()],
          params: [], // TODO
        };

        // Memory Bus Connections
        if (obj.addr) {
          vinst.ioport = [...vinst.ioport, ...genBusPorts(obj.name)];
          vwires = [...vwires, ...genBusWires(obj.name, obj.addr)];
        }

        // IO Connections
        obj.pack.ports.forEach((port) => {
          if (port.direct === "in") {
            const wire = wires.find(({ last }) => eqPortKey(last, [obj.name, port.name]));
            if (wire) {
              vinst.ioport = [...vinst.ioport, { port: port.name, wire: wireName(wire.first) }];
            } else {
              console.log(`Open port: ${obj.name}.${port.name}`);
              vinst.ioport = [...vinst.ioport, { port: port.name, wire: verilog.const({ width: port.bit, value: 0 }) }];
            }
          }
          if (port.direct === "out") {
            const wire = wires.find(({ first }) => eqPortKey(first, [obj.name, port.name]));
            if (wire) {
              const typeCheck = wire.width === port.bit;
              if (typeCheck) {
                vwires = [...vwires, { name: wireName([obj.name, port.name]), width: port.bit }];
                vinst.ioport = [...vinst.ioport, { port: port.name, wire: wireName([obj.name, port.name]) }];
                return;
              } else {
                console.log(`Invalid width: ${obj.name}.${port.name}`);
              }
            } else {
              console.log(`Open port: ${obj.name}.${port.name}`);
            }
          }
        });
        return [verilog.instance(vinst), ...vwires.map(verilog.wire)].join("\n");
      } else return [];
    })
    .join("\n\n");
};
